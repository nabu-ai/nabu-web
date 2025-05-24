"use client";

import { useSearchParams } from "next/navigation";
import useAgora from "@/hooks/useAgora";
import VideoTile from "@/components/VideoTile";
import ControlBar from "@/components/ControlBar";
import ChatPanel from "@/components/ChatPanel";
import ParticipantsPanel from "@/components/ParticipantsPanel";
import { useMeetingStore } from "@/store/useMeetingStore";
import TranscriptPanel from "@/components/TranscriptPanel";

const APP_ID = "2b6e358cb3a140e0952e4d7b757a4ca9";
const TEMP_TOKEN =
  "007eJxTYFi3i0uh62/ZrfWL1t8tjejsD7tu4iZttthobmnFxYNp85sUGIySzFKNTS2Sk4wTDU0MUg0sTY1STVLMk8xNzRNNkhMt/dcaZDQEMjIoTGhkYWSAQBCfhSEvMamUgQEAj1sftA=="; // Replace with real token if using secure join

export default function MeetingPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Guest";
  const camOn = false; //searchParams.get('camOn') === 'true';
  const micOn = false; //searchParams.get('micOn') === 'true';
  const lang = searchParams.get("lang") || "en";
  const room = searchParams.get("room") || "nabu";
  // const uid = `${name}-${Math.floor(Math.random() * 100000)}`;
  const uid = name;

  const { localTracks, remoteUsers } = useAgora(
    APP_ID,
    TEMP_TOKEN,
    room,
    name,
    micOn,
    camOn
  );
  return (
    <>
      <div className="flex h-screen bg-gray-900 text-white pb-20">
        {/* Main Screen */}
        <div className="flex-1 flex p-4 w-full bg-white rounded-xl m-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full transition-all">
            {localTracks[1] && (
              <VideoTile
                user={{
                  name: String(name),
                  uid: String(uid),
                  audioTrack: localTracks[0],
                  videoTrack: localTracks[1],
                }}
                isLocal={true}
              />
            )}
            {remoteUsers.map((user) => (
              <VideoTile
                key={String(user.uid)}
                user={{
                  name: String(name),
                  uid: String(user.uid),
                  videoTrack: user.videoTrack,
                  audioTrack: user.audioTrack,
                  hasVideo: user.hasVideo,
                }}
                isLocal={false}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar (Chat) */}
        <ChatPanel uid={uid} />
        <TranscriptPanel uid={uid} />
        <ParticipantsPanel
          localUid={uid}
          localName={name}
          remoteUsers={remoteUsers}
        />
      </div>
      <ControlBar uid={uid} roomName={room} />
    </>
  );
}
