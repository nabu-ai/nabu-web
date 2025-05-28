

"use client";

import { useEffect, useRef, useState } from 'react';
//import AgoraRTC, { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';

//mport { client } from '@/lib/agoraClient';
import { useMeetingStore } from '@/store/useMeetingStore';



export default function useAgora(
  appId: string,
  token: string,
  channel: string,
  uid: string,
  camOn: boolean
) {

  const AgoraRTC = useMeetingStore((s) => s.agoraInstance);
  let client = useMeetingStore((s) => s.agoraClient);

  const camTrackRef = useRef<any>(null);
  const [localTracks, setLocalTracks] = useState<any[]>([]);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const joinedRef = useRef(false);


// useEffect(() => {
//   (async () => {
//     AgoraRTC = (await import('agora-rtc-sdk-ng')).default;

//     client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });   
//     // rest of your Agora logic

//     //start(_client);
//   })();
// }, []);

  const updateRemoteUsers = () => {
    setRemoteUsers([...client.remoteUsers]);
  };

  const start = async () => {
    if (joinedRef.current) return;

    try {
      await client.join(appId, channel, token, uid);
      joinedRef.current = true;

      const camTrack = await AgoraRTC.createCameraVideoTrack();
      camTrack.setEnabled(camOn);

      camTrackRef.current = camTrack;
      setLocalTracks([null, camTrack]); // [audio, video] — audio is null

      await client.publish([camTrack]);

      for (const user of client.remoteUsers) {
        if (user.hasVideo) await client.subscribe(user, 'video').catch(() => {});
      }

      updateRemoteUsers();

      client.on('user-joined', updateRemoteUsers);
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType).catch(() => {});
        updateRemoteUsers();
      });
      client.on('user-unpublished', updateRemoteUsers);
      client.on('user-left', updateRemoteUsers);
      client.on('user-updated', updateRemoteUsers);
    } catch (err) {
      console.error('[Agora Error] Failed to start video-only session:', err);
      joinedRef.current = false;
    }
  };

  useEffect(() => {
   
    start()

    const leaveOnUnload = () => {
      client?.leave().catch(() => {});
    };
    // window && window.addEventListener('beforeunload', leaveOnUnload);

    return () => {
      camTrackRef.current?.stop();
      camTrackRef.current?.close();
      client?.leave().catch(() => {});
      joinedRef.current = false;
      // window && window.removeEventListener('beforeunload', leaveOnUnload);
    };
  }, []);

  const videoEnabled = useMeetingStore((s) => s.videoEnabled);
  useEffect(() => {
    camTrackRef.current?.setEnabled?.(videoEnabled);
  }, [videoEnabled]);

  return { localTracks, remoteUsers };
}


// The Agora client is used to manage the video session, including joining the channel, publishing tracks, and handling user events.
// The `useMeetingStore` is used to manage the video state across the application.
// The `useEffect` hook is used to start the Agora session when the component mounts and to clean up resources when it unmounts.
// The `useRef` hook is used to keep track of the camera track and whether the user has joined the session.
// The `useState` hook is used to manage the local tracks and remote users.     