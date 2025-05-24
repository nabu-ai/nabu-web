'use client';

import { useEffect, useRef, useState } from 'react';
import { useMeetingStore } from '@/store/useMeetingStore';

export default function VideoTile({ user, isLocal }: { user: any; isLocal?: boolean }) {
    const videoRef = useRef<HTMLDivElement>(null);
    const { raisedHands, activeSpeakerUid, muted } = useMeetingStore();
    const isLocalVideoEnabled = useMeetingStore((s) => s.videoEnabled);

    const isRaised = raisedHands[user.uid];
    const isSpeaker = activeSpeakerUid === user.uid;
    const isMuted = isLocal ? muted : user.audioTrack?.isEnabled?.() === false;
    const [hasVideo, setHasVideo] = useState(true)

    const isVideoEnabled = user.videoTrack?.isEnabled?.() !== false;
    const showPlaceholder = !user.videoTrack || !isVideoEnabled;
   

//   useEffect(() => {
//     const container = videoRef.current;

//     if (
//       container &&
//       user?.videoTrack &&
//       typeof user.videoTrack.play === 'function'
//     ) {
//       container.innerHTML = '';
//       try {
//         user.videoTrack.play(container);
//       } catch (err) {
//         console.warn(`Video play failed for ${user.uid}`, err);
//       }
//     }

//     return () => {
//       if (
//         user?.videoTrack &&
//         typeof user.videoTrack.stop === 'function'
//       ) {
//         user.videoTrack.stop();
//       }
//       if (container) container.innerHTML = '';
//     };
//   }, [user.videoTrack, user.uid]);


// useEffect(() => {
//     const container = videoRef.current;
  
//     if (
//       container &&
//       user?.videoTrack &&
//       typeof user.videoTrack.play === 'function'
//     ) {
//       container.innerHTML = '';
//       setTimeout(() => {
//         try {
//           user.videoTrack.play(container);
//           console.log(`Video started for ${user.uid}`);
//         } catch (err) {
//           console.warn(`Video play error for ${user.uid}`, err);
//         }
//       }, 100); // short delay ensures DOM is ready
//     }
//   }, [user.videoTrack, user.uid]);


useEffect(() => {
    console.log("in toggling")
    const container = videoRef.current;
  
    // Defensive check: only proceed if .play is a valid function
    if (
      container &&
      user?.videoTrack &&
      typeof user.videoTrack.play === 'function'
    ) {
      container.innerHTML = '';
      try {
        user.videoTrack.play(container);
        setHasVideo(true)
        console.log(`Playing video for ${user.uid}`);
      } catch (err) {
        console.warn(`Video play error for ${user.uid}:`, err);
      }
    } else {
        setHasVideo(false)
      console.log(`No playable videoTrack yet for ${user.uid}`);
    }
  
    return () => {
      if (
        user?.videoTrack &&
        typeof user.videoTrack.stop === 'function'
      ) {
        user.videoTrack.stop();
      }
      if (container) container.innerHTML = '';
    };
  }, [user.videoTrack, user.uid]);
  
  useEffect(() => {
    console.log("hasVideo:::", hasVideo)
  }, [hasVideo])

  useEffect(() => {
    console.log("isLocalVideoEnabled:::", isLocalVideoEnabled)
    //setHasVideo(isLocalVideoEnabled)
  }, [isLocalVideoEnabled])

  useEffect(() => {
    console.log("user::::", user)
  }, [user])


  return (
    <div className={`relative aspect-video rounded-xl overflow-hidden bg-black shadow ${isSpeaker ? 'ring-4 ring-blue-400' : ''}`}>
      {isLocal ? (isLocalVideoEnabled ? (
        <div ref={videoRef} className="w-full h-full" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white text-2xl bg-gray-800">
          {user.uid.toString().charAt(0).toUpperCase()}
        </div>
      )) : (
        hasVideo ? (
          <div ref={videoRef} className="w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-2xl bg-gray-800">
            {user.uid.toString().charAt(0).toUpperCase()}
          </div>
        )
      )}
      {/* {user.videoTrack ? (
        <div ref={videoRef} className="w-full h-full" />
        ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xl">
            {user.uid.toString().charAt(0).toUpperCase()}
        </div>
        )} */}

      {isMuted && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-60 p-1 rounded-full">
          🔇
        </div>
      )}

      <div className="absolute bottom-2 left-2 text-xs bg-black bg-opacity-60 text-white px-2 py-1 rounded">
        {/* {isLocal ? `'You'` : `${user.uid}`} {isRaised && '✋'} */}
        {`${user.uid}`} {isRaised && '✋'}
      </div>
    </div>
  );
}
