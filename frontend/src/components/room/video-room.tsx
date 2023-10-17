import React, { useEffect, useRef, useState } from 'react';
import { LocalParticipant, LocalVideoTrack, Participant, RemoteParticipant, RemoteTrack, RemoteVideoTrack, Room, Track } from 'twilio-video';
import { Button } from '../ui/button';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

interface VideoRoomProps {
    room: Room | null;
}

function SingleVideoTrack({ track, userId, isLocal, isMute, toggleMute, isCameraOn, toggleCamera }:
    {
        track: RemoteVideoTrack | LocalVideoTrack, userId: string, isLocal: boolean,
        isMute: boolean, toggleMute: () => void,
        isCameraOn: boolean, toggleCamera: () => void
    }) {
    const videoContainer = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!isLocal) {
            console.log("remote track");
        }
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
        <div className="w-64 h-36 p-2 flex flex-col items-center justify-center border border-primary rounded-lg">
            <div ref={videoContainer}></div>
            <div className="flex-1 ml-1 w-full h-8 flex items-center justify-between">
                <p>{userId}</p>
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

export default function VideoRoom({ room }: VideoRoomProps) {
    const videoRef = useRef<HTMLDivElement>(null);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMute, setIsMute] = useState(false);
    const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
    const [localParticipant, setLocalParticipant] = useState<LocalParticipant | null>(null);


    const handleNewParticipant = (participant: RemoteParticipant) => {

        participant.on('trackSubscribed', track => {
            setParticipants(participants.map(p => p))
        });

        participant.on('trackUnsubscribed', track => {
            setParticipants(participants.map(p => p))
        });
    };

    const participantConnected = (participant: RemoteParticipant) => {
        console.log('Participant "%s" connected,', participant.identity);
        console.log([...participants, participant])

        setParticipants([...participants, participant]);

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
                setIsCameraOn(!isCameraOn);
            }
        });
    };

    const toggleMute = () => {
        room?.localParticipant.audioTracks.forEach(publication => {
            if (publication.track) {
                publication.track.enable(!isMute);
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
    }, [room, handleNewParticipant, participantConnected, participantDisconnected]);

    return (
        <div ref={videoRef} className="flex gap-4 absolute bottom-10">
            {localParticipant ? Array.from(localParticipant.videoTracks.values()).map(publication => {
                if (publication.track.kind === 'video') {
                    return <SingleVideoTrack track={publication.track} key={localParticipant.identity} userId={localParticipant.identity} isLocal={true} isMute={isMute} toggleMute={toggleMute} isCameraOn={isCameraOn} toggleCamera={toggleCamera} />;
                } else { return null; }
            }) : null}
            {participants.flatMap(participant => {
                return Array.from(participant.videoTracks.values()).map(publication => {
                    if (publication.track?.kind === 'video') {
                        return <SingleVideoTrack track={publication.track} key={participant.identity} userId={participant.identity} isLocal={false} isMute={isMute} toggleMute={toggleMute} isCameraOn={isCameraOn} toggleCamera={toggleCamera} />;
                    } else { return null; }
                });
            })}
        </div>
    );
}
