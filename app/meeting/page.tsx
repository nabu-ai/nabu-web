'use client';

import { useSearchParams } from 'next/navigation';
import useAgora from '@/hooks/useAgoraVideoOnly';
import VideoTile from '@/components/VideoTile';
import ControlBar from '@/components/ControlBar';
import SidebarToggles from '@/components/SidebarToggles';
import ChatPanel from '@/components/ChatPanel';
import ParticipantsPanel from '@/components/ParticipantsPanel';
import { useMeetingStore } from '@/store/useMeetingStore';
import { useEffect } from 'react';

const APP_ID = '';
const TEMP_TOKEN = ''; // Replace with real token if using secure join


export default function MeetingPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Guest';
  const camOn = true;
  const room = searchParams.get('room') || 'nabu-test';
  const uid = name;

  const { localTracks, remoteUsers } = useAgora(APP_ID, TEMP_TOKEN, room, name, camOn);

  const isChatOpen = useMeetingStore((s) => s.isChatOpen);
  const isParticipantsOpen = useMeetingStore((s) => s.isParticipantsOpen);
  const sidePanelWidth = isChatOpen ? 'sm:mr-96' : isParticipantsOpen ? 'sm:mr-80' : '';

  useEffect(() => {
  }, [remoteUsers])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <SidebarToggles />
      <ChatPanel uid={uid} />
      <ParticipantsPanel localUid={uid} localName={name} remoteUsers={remoteUsers} />

      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-all ${sidePanelWidth}`}>
        {localTracks[1] && (
          <VideoTile user={{ name: String(name), uid: String(uid), videoTrack: localTracks[1] }} isLocal={true} />
        )}
        {remoteUsers.map((user) => (
          <VideoTile key={String(user.uid)}
          user={{
            name: String(name),
            uid: String(user.uid),
            videoTrack: user.videoTrack,
            audioTrack: user.audioTrack,
            hasVideo: user.hasVideo
          }} isLocal={false}/>
        ))}
      </div>

      <ControlBar uid={uid} />
    </div>
  );
}

