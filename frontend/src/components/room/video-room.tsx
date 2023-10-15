import React, { useEffect, useRef } from 'react';
import { Room } from 'twilio-video';

interface VideoRoomProps {
    room: Room | null;
}

export default function VideoRoom({ room }: VideoRoomProps ) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!room) return;
        
        room.localParticipant.tracks.forEach(publication => {
            if (publication.track?.kind === 'video') {
                videoRef.current?.appendChild(publication.track.attach());
            }
        });

        room.participants.forEach(participant => {
            console.log(participant)
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

