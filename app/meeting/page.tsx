"use client";

import useAgora from "@/hooks/useAgoraVideoOnly";
import VideoTile from "@/components/VideoTile";
import ControlBar from "@/components/ControlBar";
import ChatPanel from "@/components/ChatPanel";
import ParticipantsPanel from "@/components/ParticipantsPanel";
import { useMeetingStore } from "@/store/useMeetingStore";
import TranscriptPanel from "@/components/TranscriptPanel";
import { useUserStore } from "@/store/useUserStore";

export default function MeetingPage() {
  const meetingInfo = useMeetingStore((s) => s.meetingInfo);
  const userData = useUserStore((s) => s.userData);

  const name = meetingInfo.name || "Guest";
  const camOn = false;   // Default to true for video-only mode
  const lang = meetingInfo.language || "en-US";
  const room = meetingInfo.room;
  const uid = name;
  


  const { localTracks, remoteUsers } = useAgora(
    meetingInfo.appId,
    meetingInfo.token,
    meetingInfo.meetingId,
    meetingInfo.name,
    camOn
  );

  return (
    <>
      <div className="flex h-screen bg-gray-900 text-white pr-20">
        {/* Main Screen */}
        <div className="flex-1 flex p-4 w-full bg-white rounded-xl m-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full transition-all">
            {localTracks[1] && (
              <VideoTile
                user={{
                  name: String(name),
                  uid: String(uid),
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
                  hasVideo: user.hasVideo,
                }}
                isLocal={false}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar (Chat) */}
        <ChatPanel uid={uid} room={room}/>
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
