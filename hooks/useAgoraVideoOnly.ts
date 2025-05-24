'use client';

import { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { client } from '@/lib/agoraClient';
import { useMeetingStore } from '@/store/useMeetingStore';

export default function useAgora(
  appId: string,
  token: string,
  channel: string,
  uid: string,
  micOn: string,
  camOn: boolean
) {
  const camTrackRef = useRef<any>(null);
  const [localTracks, setLocalTracks] = useState<any[]>([]);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);

  const joinedRef = useRef(false);
  const isMountedRef = useRef(true);
  const isStartingRef = useRef(false); // NEW: to prevent parallel start calls

  const updateRemoteUsers = () => {
    setRemoteUsers([...client.remoteUsers]);
  };

  // const start = async () => {
  //   if (joinedRef.current || isStartingRef.current) {
  //     console.warn('[Agora] Already starting or joined');
  //     return;
  //   }

  //   isStartingRef.current = true;

  //   try {
  //     console.log('[Agora] Joining channel...');
  //     await client.join(appId, channel, token, uid);
  //     joinedRef.current = true;
  //     if (!isMountedRef.current) return;

  //     console.log('[Agora] Creating camera track...');
  //     const camTrack = await AgoraRTC.createCameraVideoTrack();
  //     camTrack.setEnabled(camOn);

  //     camTrackRef.current = camTrack;
  //     setLocalTracks([camTrack]);

  //     console.log('[Agora] Publishing...');
  //     await client.publish([camTrack]);

  //     // Subscribe to existing remote users
  //     for (const user of client.remoteUsers) {
  //       if (user.hasVideo) await client.subscribe(user, 'video').catch(() => {});
  //     }

  //     updateRemoteUsers();

  //     // Listeners
  //     client.on('user-published', async (user, mediaType) => {
  //       await client.subscribe(user, mediaType).catch(() => {});
  //       updateRemoteUsers();
  //     });

  //     client.on('user-unpublished', updateRemoteUsers);
  //     client.on('user-left', updateRemoteUsers);
  //     client.on('user-updated', updateRemoteUsers);
  //   } catch (err) {
  //     console.error('[Agora Error] Failed to start:', err);
  //     joinedRef.current = false; // Allow retry if start fails
  //   } finally {
  //     isStartingRef.current = false;
  //   }
  // };

  const start = async () => {
    if (joinedRef.current || isStartingRef.current) return;
    isStartingRef.current = true;
  
    try {
      console.log('[Agora] Joining...');
      await client.join(appId, channel, token, uid);
      joinedRef.current = true;
      if (!isMountedRef.current) return;
  
      // ✅ Wait until Agora connection is fully ready
      await new Promise<void>((resolve) => {
        const checkState = (curState: string) => {
          if (curState === 'CONNECTED') {
            client.off('connection-state-change', checkState);
            resolve();
          }
        };
        client.on('connection-state-change', checkState);
      });
  
      console.log('[Agora] Creating camera track...');
      const camTrack = await AgoraRTC.createCameraVideoTrack();
      camTrack.setEnabled(true);
  
      camTrackRef.current = camTrack;
      setLocalTracks([camTrack]);
  
      console.log('[Agora] Publishing...');
      await client.publish([camTrack]);
      console.log('[Agora] Published');
  
      for (const user of client.remoteUsers) {
        if (user.hasVideo) await client.subscribe(user, 'video').catch(() => {});
      }
  
      updateRemoteUsers();
  
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType).catch(() => {});
        updateRemoteUsers();
      });
  
      client.on('user-unpublished', updateRemoteUsers);
      client.on('user-left', updateRemoteUsers);
      client.on('user-updated', updateRemoteUsers);
    } catch (err) {
      console.error('[Agora Error] Failed to start:', err);
      joinedRef.current = false;
    } finally {
      isStartingRef.current = false;
    }
  };
  

  useEffect(() => {
    isMountedRef.current = true;
    start();

    const leaveOnUnload = () => {
      client.leave().catch(() => {});
    };
    window.addEventListener('beforeunload', leaveOnUnload);

    return () => {
      isMountedRef.current = false;

      if (camTrackRef.current) {
        camTrackRef.current.stop();
        camTrackRef.current.close();
      }

      client.leave().catch(() => {});
      joinedRef.current = false;
      window.removeEventListener('beforeunload', leaveOnUnload);
    };
  }, []);

  // Zustand-driven video toggle
  const videoEnabled = useMeetingStore((s) => s.videoEnabled);
  useEffect(() => {
    camTrackRef.current?.setEnabled(videoEnabled);
  }, [videoEnabled]);

  return { localTracks, remoteUsers };
}
