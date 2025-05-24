'use client';

import { useEffect, useRef } from 'react';
import { useMeetingStore } from '@/store/useMeetingStore';

export default function VideoTile({ user, isLocal }: { user: any; isLocal?: boolean }) {
  const videoRef = useRef<HTMLDivElement>(null);
  const { raisedHands, activeSpeakerUid, muted } = useMeetingStore();

  const isRaised = raisedHands[user.uid];
  const isSpeaker = activeSpeakerUid === user.uid;
  const isMuted = isLocal ? muted : user.audioTrack?.isEnabled?.() === false;

  const isLocalVideoEnabled = useMeetingStore((s) => s.videoEnabled);
  const isVideoEnabled = isLocal
    ? isLocalVideoEnabled
    : user.videoTrack?.isEnabled?.() === true;
  // Show placeholder when track is missing or disabled
  const showPlaceholder = !user.videoTrack || !isVideoEnabled;

  useEffect(() => {
    const container = videoRef.current;
  
    if (
      !showPlaceholder &&
      container &&
      user?.videoTrack &&
      typeof user.videoTrack.play === 'function'
    ) {
      container.innerHTML = '';
      try {
        user.videoTrack.play(container);
      } catch (err) {
        console.warn(`Video play error for ${user.uid}`, err);
      }
    } else if (container) {
      container.innerHTML = ''; // clear blank canvas
    }
  
    return () => {
      if (user.videoTrack && typeof user.videoTrack.stop === 'function') {
        user.videoTrack.stop();
      }
      if (container) container.innerHTML = '';
    };
  }, [user.videoTrack, user.uid, showPlaceholder]);
  

  return (
    <div
      className={`relative aspect-video rounded-xl overflow-hidden bg-black shadow ${
        isSpeaker ? 'ring-4 ring-blue-400' : ''
      }`}
    >
      {showPlaceholder ? (
        <div className="w-full h-full flex items-center justify-center text-white text-2xl bg-gray-800">
          {user.uid.toString().charAt(0).toUpperCase()}
        </div>
      ) : (
        <div ref={videoRef} className="w-full h-full" />
      )}

      {isMuted && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-60 p-1 rounded-full">
          🔇
        </div>
      )}

      <div className="absolute bottom-2 left-2 text-xs bg-black bg-opacity-60 text-white px-2 py-1 rounded">
        {`${user.uid}`} {isRaised && '✋'}
      </div>
    </div>
  );
}
