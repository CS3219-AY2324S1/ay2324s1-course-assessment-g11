import React, { useContext, useEffect, useRef, useState } from 'react';
import { LocalParticipant, LocalVideoTrack, Participant, RemoteParticipant, RemoteAudioTrack, RemoteVideoTrack, Room, Track } from 'twilio-video';
import { Button } from '../ui/button';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { AuthContext } from '../../contexts/AuthContext';

interface VideoRoomProps {
    room: Room | null;
    className?: string;
}

function SingleVideoTrack({ track, userId, displayName, isLocal, isMute, toggleMute, isCameraOn, toggleCamera }:
    {
        track: RemoteVideoTrack | LocalVideoTrack, userId: string, displayName: string, isLocal: boolean,
        isMute: boolean, toggleMute: () => void,
        isCameraOn: boolean, toggleCamera: () => void
    }) {
    const videoContainer = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const videoElement = track.attach();
        videoElement.classList.add("w-full", "h-full", "items-center", "justify-center", "flex");
        videoContainer.current?.appendChild(videoElement);
        return () => {
            track.detach().forEach(element => element.remove());
            videoElement.remove();
        };
    }, [isLocal, track]);
    return (<div
        className="flex items-center justify-start gap-4"
        key={userId}
    >
        <div className="w-64 p-2 flex flex-col items-center justify-center border border-primary rounded-lg">
            <div ref={videoContainer}></div>
            <div className="flex-1 ml-1 w-full h-8 flex items-center justify-between">
                <p>{displayName}</p>
                {isLocal ? <div className="flex flex-row gap-2 justify-end">
                    <Button variant="ghost" size="icon" onClick={toggleCamera}>
                        {isCameraOn ? <Video /> : <VideoOff />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={toggleMute}>
                        {isMute ? <MicOff /> : <Mic />}
                    </Button>
                </div> : null}
            </div>
        </div>
    </div>);
}

function SingleAudioTrack({track}: {track: RemoteAudioTrack}) {
    const audioContainer = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const audioElement = track.attach();
        audioContainer.current?.appendChild(audioElement);
        return () => {
            track.detach().forEach(element => element.remove());
            audioElement.remove();
        };
    }, [track]);
    return (<div
        ref={audioContainer}
    ></div>);
}

const VideoRoom: React.FC<VideoRoomProps> = ({ room, className }) => {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMute, setIsMute] = useState(true);
    const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
    const [localParticipant, setLocalParticipant] = useState<LocalParticipant | null>(null);
    const [participantNames, setParticipantNames] = useState<{[id: string]: string}>({});
    const {user} = useContext(AuthContext);
    const {getAppUser} = useUser();


    const handleNewParticipant = (participant: RemoteParticipant) => {
        if (!(participant.identity in participantNames)) {
            setParticipantNames(p => ({...p, [participant.identity]: "Loading..."}));
            getAppUser(participant.identity, false).then(user => {
                setParticipantNames(p => ({...p, [participant.identity]: user?.displayName || ""}));
            }).catch(err => console.log);
        }

        participant.on('trackSubscribed', track => {
            setParticipants(p => [...p])
        });

        participant.on('trackUnsubscribed', track => {
            setParticipants(p => [...p])
        });
    };

    const participantConnected = (participant: RemoteParticipant) => {
        console.log('Participant "%s" connected,', participant.identity);

        setParticipants(participants => [...participants, participant]);
        handleNewParticipant(participant);
    };

    const participantDisconnected = (participant: RemoteParticipant) => {
        console.log('Participant "%s" disconnected', participant.identity);
        participant.removeAllListeners();
        setParticipants(participants.filter(p => p.identity !== participant.identity));
    };

    const toggleCamera = () => {
        room?.localParticipant.videoTracks.forEach(publication => {
            if (publication.track) {
                publication.track.enable(!isCameraOn);
                if (isCameraOn) {
                    setTimeout(publication => publication.track.stop(), 1000, publication);
                } else {
                    publication.track.restart();
                }
                setIsCameraOn(!isCameraOn);
            }
        });
    };

    const toggleMute = () => {
        room?.localParticipant.audioTracks.forEach(publication => {
            if (publication.track) {
                publication.track.enable(isMute);
                setIsMute(!isMute);
            }
        });
    };

    useEffect(() => {
        if (!room) return;

        room.on('participantConnected', participantConnected);
        room.on('participantDisconnected', participantDisconnected);
        room.once('disconnected', error => room.participants.forEach(participantDisconnected));

        setLocalParticipant(room.localParticipant);

        room.participants.forEach(handleNewParticipant);

        setParticipants(Array.from(room.participants.values()));

        return () => {
            room.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [room]);

    return (
        <div className={className}>
        <div className="flex gap-4 absolute bottom-10">
            {localParticipant ? Array.from(localParticipant.videoTracks.values()).map(publication => {
                if (publication.track.kind === 'video') {
                    return <SingleVideoTrack track={publication.track} key={localParticipant.identity} userId={localParticipant.identity} displayName={user?.displayName || ""} isLocal={true} isMute={isMute} toggleMute={toggleMute} isCameraOn={isCameraOn} toggleCamera={toggleCamera} />;
                } else { return null; }
            }) : null}
            {participants.flatMap(participant => {
                return Array.from(participant.videoTracks.values()).map(publication => {
                    if (publication.track?.kind === 'video') {
                        return <SingleVideoTrack track={publication.track} key={participant.identity} userId={participant.identity} displayName={participantNames[participant.identity] || "Loading..."} isLocal={false} isMute={isMute} toggleMute={toggleMute} isCameraOn={isCameraOn} toggleCamera={toggleCamera} />;
                    } else {
                        return null; 
                    }
                });
            })}
            {participants.flatMap(participant => {
                return Array.from(participant.audioTracks.values()).map(audioPublication => {
                    if (audioPublication.track?.kind === 'audio') {
                        return <SingleAudioTrack track={audioPublication.track} key={participant.identity} />;
                    } else {
                        return null;
                    }
                });
            })}
        </div></div>
    );
};

export default VideoRoom;
