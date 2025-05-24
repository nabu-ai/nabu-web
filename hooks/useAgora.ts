'use client';

import { useEffect, useRef, useState } from 'react';
import AgoraRTC, { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { client } from '@/lib/agoraClient';
import { useMeetingStore } from '@/store/useMeetingStore';

export default function useAgora(
  appId: string,
  token: string,
  channel: string,
  uid: string,
  micOn: boolean,
  camOn: boolean
) {
  const localTracksRef = useRef<any[]>([]);
  const [localTracks, setLocalTracks] = useState<any[]>([]);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const joinedRef = useRef(false);

  const updateRemoteUsers = () => {
    setRemoteUsers([...client.remoteUsers]);

  };

  const start = async () => {
    if (joinedRef.current) return;
    try {
      await client.join(appId, channel, token, uid);
      joinedRef.current = true;

      const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const camTrack = await AgoraRTC.createCameraVideoTrack();

      micTrack.setEnabled(micOn);
      camTrack.setEnabled(camOn);

      localTracksRef.current = [micTrack, camTrack];
      setLocalTracks([micTrack, camTrack]);

      updateRemoteUsers();

      await client.publish([micTrack, camTrack]);

      for (const user of client.remoteUsers) {
        if (user.hasVideo) await client.subscribe(user, 'video').catch(() => {});
        if (user.hasAudio) await client.subscribe(user, 'audio').catch(() => {});
      }

      
      client.on('user-joined', (user) => {
        setRemoteUsers([...client.remoteUsers]);
      });

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType).catch(() => {});
        updateRemoteUsers();
      });

      client.on('user-unpublished', updateRemoteUsers);
      client.on('user-left', updateRemoteUsers);
      client.on('user-updated', updateRemoteUsers);

      client.enableAudioVolumeIndicator();
      client.on('volume-indicator', (volumes) => {
        const loudest = volumes.reduce((max, v) => (v.level > max.level ? v : max), volumes[0]);
        if (loudest?.uid) {
          useMeetingStore.getState().setActiveSpeaker(String(loudest.uid));
        }
      });
    } catch (err) {
      console.error('[Agora Error] Failed to start:', err);
      joinedRef.current = false;
    }
  };

  useEffect(() => {
    start();

    const leaveOnUnload = () => {
      client.leave().catch(() => {});
    };
    window.addEventListener('beforeunload', leaveOnUnload);

    return () => {
      const [mic, cam] = localTracksRef.current;
      mic?.stop();
      mic?.close();
      cam?.stop();
      cam?.close();

      client.leave().catch(() => {});
      joinedRef.current = false;
      window.removeEventListener('beforeunload', leaveOnUnload);
    };
  }, []);

  const muted = useMeetingStore((s) => s.muted);
  useEffect(() => {
    const mic = localTracksRef.current[0];
    mic?.setEnabled?.(!muted);
  }, [muted]);

  const videoEnabled = useMeetingStore((s) => s.videoEnabled);
  useEffect(() => {
    const cam = localTracksRef.current[1];
    cam?.setEnabled?.(videoEnabled);
  }, [videoEnabled]);

  return { localTracks, remoteUsers };
}
