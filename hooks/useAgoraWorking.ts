'use client';

import { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { client } from '@/lib/agoraClient';
import { useMeetingStore } from '@/store/useMeetingStore';
import useTokenRenewal from './useTokenRenewal';

export default function useAgora(appId, token, channel, uid, micOn, camOn) {
  const localTracksRef = useRef([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [remoteUsers, setRemoteUsers] = useState([]);
  //const token = useTokenRenewal(channel, uid,);

  const updateRemoteUsers = () => {
    setRemoteUsers([...client.remoteUsers]);
  };
  

  useEffect(() => {
    let isMounted = true;
    let alreadyJoined = false;

    const start = async () => {
      try {
        if (alreadyJoined) return;

        // const token = "007eJxTYOAoCeUtOZ/sJ/Ofdz6j69PtVgzdOd0ztwhxrTLnMet/uUOBwSjJLNXY1CI5yTjR0MQg1cDS1CjVJMU8ydzUPNEkOdFSVcsgoyGQkaHoTRIrIwMEgvgsDHmJSaUMDABG+hvv"

        console.log('[Agora] Joining channel...');
        await client.join(appId, channel, token, uid);

        

        // // subscribe to already connected users
        // client.remoteUsers.forEach(async (user) => {
        //   await client.subscribe(user, 'video').catch(() => {});
        //   await client.subscribe(user, 'audio').catch(() => {});
        // });
        // updateRemoteUsers();

        alreadyJoined = true;

        if (!isMounted) return;

        const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const camTrack = await AgoraRTC.createCameraVideoTrack();

        micTrack.setEnabled(micOn);
        camTrack.setEnabled(camOn);

        localTracksRef.current = [micTrack, camTrack];
        setLocalTracks([micTrack, camTrack]);

        await client.publish([micTrack, camTrack]);

        if (!isMounted) return;

        console.log('[Agora] Published audio/video');

        // 🔥 Manually subscribe to existing users
      for (const user of client.remoteUsers) {
        try {
          if (user.hasVideo) await client.subscribe(user, 'video');
          if (user.hasAudio) await client.subscribe(user, 'audio');
        } catch (err) {
          console.warn(`Failed to subscribe to existing user ${user.uid}`, err);
        }
      }

      setRemoteUsers([...client.remoteUsers]);

        // client.on('user-published', async (user, mediaType) => {
        //   try {
        //     await client.subscribe(user, mediaType);
        //     if (!isMounted) return;
        //     setRemoteUsers((prev) => {
        //       const others = prev.filter((u) => u.uid !== user.uid);
        //       return [...others, user];
        //     });
        //   } catch (err) {
        //     console.warn('Failed to subscribe to user:', err);
        //   }
        // });

        // client.on('user-published', async (user, mediaType) => {
        //   try {
        //     await client.subscribe(user, mediaType);
        //     updateRemoteUsers(); // <- refresh full user list
        //   } catch (err) {
        //     console.warn('Subscribe failed:', err);
        //   }
        // });

        // client.on('user-published', async (user, mediaType) => {
        //   try {
        //     await client.subscribe(user, mediaType);
        
        //     if (mediaType === 'video') {
        //       // Wait until user.videoTrack is ready
        //       let attempts = 10;
        //       while (!user.videoTrack && attempts > 0) {
        //         await new Promise((res) => setTimeout(res, 100));
        //         attempts--;
        //       }
        //     }
        
        //     updateRemoteUsers();
        //   } catch (err) {
        //     console.warn('Subscribe failed:', err);
        //   }
        // });

        client.on('user-updated', (user, mediaType) => {
            console.log(`[Agora] user-updated: ${user.uid}, type: ${mediaType}`);
            updateRemoteUsers();
          });

        client.on('user-published', async (user, mediaType) => {
          try {
            await client.subscribe(user, mediaType);
            updateRemoteUsers();
          } catch (err) {
            console.warn('Subscribe failed:', err);
          }
        });
        
        client.on('user-unpublished', (user) => {
          updateRemoteUsers(); // <- refresh user list on unpublish too
        });
        
        client.on('user-left', (user) => {
          updateRemoteUsers(); // <- refresh list on user leave
        });
        

        // client.on('user-unpublished', (user, mediaType) => {
        //   setRemoteUsers((prev) =>
        //     prev.map((u) =>
        //       u.uid === user.uid
        //         ? {
        //             ...u,
        //             [mediaType === 'video' ? 'videoTrack' : 'audioTrack']: null,
        //           }
        //         : u
        //     )
        //   );
        // });

        // client.on('user-left', (user) => {
        //   setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        // });

        client.enableAudioVolumeIndicator();
        client.on('volume-indicator', (volumes) => {
          const loudest = volumes.reduce((max, v) => (v.level > max.level ? v : max), volumes[0]);
          if (loudest?.uid) {
            useMeetingStore.getState().setActiveSpeaker(String(loudest.uid));
          }
        });
      } catch (err) {
        if (!isMounted) return;
        console.error('[Agora Error]', err);
      }
    };

    start();

    return () => {
      isMounted = false;
      const [mic, cam] = localTracksRef.current;
      mic?.stop(); mic?.close();
      cam?.stop(); cam?.close();
      client.leave();
    };
  }, []);

  // Sync mute/video toggle
  const muted = useMeetingStore((s) => s.muted);
  useEffect(() => {
    const mic = localTracksRef.current[0];
    if (mic) mic.setEnabled(!muted);
  }, [muted]);

  const videoEnabled = useMeetingStore((s) => s.videoEnabled);
  useEffect(() => {
    const cam = localTracksRef.current[1];
    if (cam) cam.setEnabled(videoEnabled);
  }, [videoEnabled]);

  return { localTracks, remoteUsers };
}
