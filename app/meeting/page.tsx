// 'use client';

// import { useSearchParams } from 'next/navigation';

// import VideoTile from '@/components/VideoTile';
// import useAgora from '@/hooks/useAgora';
// import ControlBar from '@/components/ControlBar';
// import SidebarToggles from '@/components/SidebarToggles';
// import ChatPanel from '@/components/ChatPanel';
// import ParticipantsPanel from '@/components/ParticipantsPanel';
// import { useMeetingStore } from '@/store/useMeetingStore';
// import { useEffect } from 'react';

// const APP_ID = '2b6e358cb3a140e0952e4d7b757a4ca9';
// const TEMP_TOKEN = '007eJxTYAip629csfhbds2D2tAwieWG1RKGnqpBZR2fOhZnta09MkuBwSjJLNXY1CI5yTjR0MQg1cDS1CjVJMU8ydzUPNEkOdHyXaxBRkMgI8MEcwZWRgYIBPFZGPISk0oZGAA12h6b'; // Replace with real token if using secure join

// export default function MeetingPage() {
//   const searchParams = useSearchParams();
//   const name = searchParams.get('name') || 'Guest';
//   const micOn = false;//searchParams.get('micOn') === 'true';
//   const camOn = true;//searchParams.get('camOn') === 'true';
//   const lang = searchParams.get('lang') || 'en';


//   const { localTracks, remoteUsers } = useAgora(APP_ID, TEMP_TOKEN, 'nabu', name, micOn, camOn);

//   const isChatOpen = useMeetingStore((s) => s.isChatOpen);
//   const isParticipantsOpen = useMeetingStore((s) => s.isParticipantsOpen);

//   const sidePanelWidth = isChatOpen ? 'sm:mr-96' : isParticipantsOpen ? 'sm:mr-80' : '';


//   useEffect(() => {
//   // Notifies existing user of previously joined users
//   remoteUsers.forEach(async (user) => {
//     console.log("RUser:::", user.uid)
//   })
//   }, [remoteUsers])


//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-4">
//       <h1 className="text-lg font-semibold mb-4">Meeting Room</h1>
//       <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-all ${sidePanelWidth}`}>
//         {localTracks[1] && (
//           <VideoTile user={{ videoTrack: localTracks[1], uid: name }} isLocal />
//         )}
//         {remoteUsers.map((user) => (
//           <VideoTile key={user.uid} user={user} />
//         ))}
//       </div>
//       <ControlBar uid={name} />
//       <SidebarToggles />
//       <ChatPanel uid={name} />
//       <ParticipantsPanel localUid={name} remoteUsers={remoteUsers} />
//     </div>
//   );
// }





'use client';

import { useSearchParams } from 'next/navigation';
import useAgora from '@/hooks/useAgora';
import VideoTile from '@/components/VideoTile';
import ControlBar from '@/components/ControlBar';
import SidebarToggles from '@/components/SidebarToggles';
import ChatPanel from '@/components/ChatPanel';
import ParticipantsPanel from '@/components/ParticipantsPanel';
import { useMeetingStore } from '@/store/useMeetingStore';

const APP_ID = '2b6e358cb3a140e0952e4d7b757a4ca9';
const TEMP_TOKEN = '007eJxTYFi3i0uh62/ZrfWL1t8tjejsD7tu4iZttthobmnFxYNp85sUGIySzFKNTS2Sk4wTDU0MUg0sTY1STVLMk8xNzRNNkhMt/dcaZDQEMjIoTGhkYWSAQBCfhSEvMamUgQEAj1sftA=='; // Replace with real token if using secure join


export default function MeetingPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Guest';
  const camOn = true;//searchParams.get('camOn') === 'true';
  const micOn = false;//searchParams.get('micOn') === 'true';
  const lang = searchParams.get('lang') || 'en';
  const room = searchParams.get('room') || 'nabu';
  // const uid = `${name}-${Math.floor(Math.random() * 100000)}`;
  const uid = name;

  const { localTracks, remoteUsers } = useAgora(APP_ID, TEMP_TOKEN, room, name, micOn, camOn);

  const isChatOpen = useMeetingStore((s) => s.isChatOpen);
  const isParticipantsOpen = useMeetingStore((s) => s.isParticipantsOpen);
  const sidePanelWidth = isChatOpen ? 'sm:mr-96' : isParticipantsOpen ? 'sm:mr-80' : '';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <SidebarToggles />
      <ChatPanel uid={uid} />
      <ParticipantsPanel localUid={uid} localName={name} remoteUsers={remoteUsers} />

      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-all ${sidePanelWidth}`}>
        {localTracks[1] && (
          <VideoTile user={{ name: String(name), uid: String(uid), audioTrack: localTracks[0], videoTrack: localTracks[1] }} isLocal={true} />
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

