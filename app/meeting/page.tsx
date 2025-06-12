"use client";

import useAgora from "@/hooks/useAgoraVideoOnly";
import VideoTile from "@/components/VideoTile";
import ControlBar from "@/components/ControlBar";
import ChatPanel from "@/components/ChatPanel";
import ParticipantsPanel from "@/components/ParticipantsPanel";
import { useMeetingStore } from "@/store/useMeetingStore";
import TranscriptPanel from "@/components/TranscriptPanel";

export default function MeetingPage() {
  const meetingInfo = useMeetingStore((s) => s.meetingInfo);
  const name = meetingInfo.name || "Guest";
  const camOn = false; // Default to true for video-only mode
  const lang = meetingInfo.language || "en-US";
  const room = meetingInfo.room;
  const uid = name;

  const { localTracks, remoteUsers } = useAgora(
    meetingInfo.appId,
    meetingInfo.token,
    room,
    name,
    camOn
  );
  //const remoteUsers = [...Array(10)]; // testing purpose only
  const remoteUsersLength = remoteUsers.length;
  return (
    <>
      <div className="flex h-screen bg-gray-900 text-white pr-20">
        {/* Main Screen */}
        <div className="flex-1 flex p-4 w-full bg-white rounded-xl m-4 overflow-auto">
          <div className="flex flex-wrap justify-center items-center gap-2 w-full relative">
            {remoteUsers.map((user) => (
              <div
                key={String(user?.uid)}
                className={`flex justify-center items-center bg-gray-800 rounded-lg overflow-hidden min-w-[100px]
                     ${
                       remoteUsersLength === 1
                         ? "w-full h-full"
                         : remoteUsersLength === 2
                         ? "w-1/2 h-1/2"
                         : remoteUsersLength <= 4
                         ? "w-1/3 h-1/3"
                         : remoteUsersLength <= 9
                         ? "w-1/4 h-1/4"
                         : "w-1/5 h-1/5"
                     }`}
              >
                <VideoTile
                  user={{
                    name: String(name),
                    uid: String(user?.uid),
                    videoTrack: user?.videoTrack,
                    audioTrack: user?.audioTrack,
                    hasVideo: user?.hasVideo,
                  }}
                  isLocal={false}
                />
              </div>
            ))}
            {/* Own Video in Bottom Right Corner */}
            <div className="absolute bottom-2 right-2 w-40 h-28 bg-black rounded-lg border border-gray-600 shadow-lg">
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
            </div>
          </div>
        </div>

        {/* Right Sidebar (Chat) */}
        <ChatPanel uid={uid} room={room} />
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
