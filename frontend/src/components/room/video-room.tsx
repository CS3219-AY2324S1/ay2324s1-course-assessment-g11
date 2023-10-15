import React, { useEffect, useRef } from 'react';
import { Participant, RemoteParticipant, RemoteTrack, RemoteVideoTrack, Room, Track } from 'twilio-video';

interface VideoRoomProps {
    room: Room | null;
}



export default function VideoRoom({ room }: VideoRoomProps ) {
    const videoRef = useRef<HTMLDivElement>(null);

    const trackSubscribed = (track: RemoteVideoTrack) => videoRef.current?.appendChild(track.attach());

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
    }

    useEffect(() => {
        if (!room) return;

        room.on('participantConnected', participantConnected);
        room.on('participantDisconnected', participantDisconnected);
        room.once('disconnected', error => room.participants.forEach(participantDisconnected));
        
        room.localParticipant.tracks.forEach(publication => {
            if (publication.track?.kind === 'video') {
                videoRef.current?.appendChild(publication.track.attach());
            }
        });

        room.participants.forEach(participant => {
            participant.tracks.forEach(publication => {
                if (publication.isSubscribed) {
                    const track = publication.track;
                    if (track?.kind === 'video') {
                        videoRef.current?.appendChild(track.attach());
                    }
                }
            });

            participant.on('trackSubscribed', track => {
                if (track.kind === 'video') {
                    videoRef.current?.appendChild(track.attach());
                }
            });
        });

        return () => {
            room.disconnect();
        };
    }, [room]);

    return (
        <div ref={videoRef} style={{ display: 'flex', flexDirection: 'row' }}></div>
    );
};

