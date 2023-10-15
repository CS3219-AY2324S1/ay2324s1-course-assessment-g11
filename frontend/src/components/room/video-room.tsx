import React, { useEffect, useRef, useState } from 'react';
import { Participant, RemoteParticipant, RemoteTrack, RemoteVideoTrack, Room, Track } from 'twilio-video';

interface VideoRoomProps {
    room: Room | null;
}

export default function VideoRoom({ room }: VideoRoomProps ) {
    const videoRef = useRef<HTMLDivElement>(null);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMute, setIsMute] = useState(false);

    const trackSubscribed = (track: RemoteVideoTrack) => {
        const newMediaElement = track.attach();
        newMediaElement.classList.add("h-[17vh]");
        videoRef.current?.appendChild(newMediaElement);
    };

    const trackUnsubscribed = (track: RemoteVideoTrack) => track.detach().forEach(element => element.remove());

    const participantConnected = (participant: RemoteParticipant) => {
        console.log('Participant "%s" connected', participant.identity);
    
        participant.tracks.forEach(publication => {
            if (publication.isSubscribed && publication.track?.kind === 'video') {
                trackSubscribed(publication.track as RemoteVideoTrack);
            }
        });
    
        participant.on('trackSubscribed', track => {
            if (track.kind === 'video') {
                trackSubscribed(track as RemoteVideoTrack);
            }
        });

        participant.on('trackUnsubscribed', trackUnsubscribed);
    };

    const participantDisconnected = (participant: RemoteParticipant) => {
        console.log('Participant "%s" disconnected', participant.identity);
        document.getElementById(participant.sid)?.remove();
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
        
        room.localParticipant.tracks.forEach(publication => {
            if (publication.track?.kind === 'video') {
                const newMediaElement = publication.track.attach();
                newMediaElement.classList.add("h-[17vh]");
                videoRef.current?.appendChild(newMediaElement);
            }
        });

        room.participants.forEach(participant => {
            participant.tracks.forEach(publication => {
                if (publication.isSubscribed) {
                    trackSubscribed(publication.track as RemoteVideoTrack);
                }
            });

            participant.on('trackSubscribed', trackSubscribed);
        });

        return () => {
            room.disconnect();
        };
    }, [room]);

    return (
        <div>
            <div ref={videoRef} style={{ display: 'flex', flexDirection: 'row' }} className="h-[17vh]"></div>
            <button onClick={toggleCamera}> {isCameraOn ? 'Hide Camera' : 'Show Camera'}</button>
            <button onClick={toggleMute}> {isMute ? "Unmute" : "Mute"}</button>
        </div>
    );
};

