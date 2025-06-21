"use client";

import { useMeetingStore } from "@/store/useMeetingStore";
import { EllipsisVerticalIcon, MicIcon, MicOffIcon, XIcon } from "lucide-react";
import { useState } from "react";

export default function ParticipantsPanel({
  localUid,
  localName,
  remoteUsers,
}: {
  localUid: string;
  localName: string;
  remoteUsers: any[];
}) {
  const isParticipantsOpen = useMeetingStore((s) => s.isParticipantsOpen);
  const raisedHands = useMeetingStore((s) => s.raisedHands);
  const mutedUsers = useMeetingStore((s) => s.mutedUsers);
  const muted = useMeetingStore((s) => s.muted);
  const toggleParticipants = useMeetingStore((s) => s.toggleParticipants);

  if (!isParticipantsOpen) return null;

  const users = [
    { uid: localUid, isLocal: true, muted, name: localName },
    ...remoteUsers.map((u) => ({
      uid: u.uid,
      name: u.name,
      isLocal: false,
      muted: u.audioTrack?.isPlaying !== true,
    })),
  ];

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };
  return (
    <div className="w-1/4 flex flex-col rounded-xl bg-white text-black shadow-lg  border-l m-4 ml-0">
      <div className="flex justify-between font-bold border-b">
        <div className="p-4 text-lg ">Participants</div>
        <div className="p-4">
          <button
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-theme-xl w-8 h-8 inline-flex justify-center items-center"
            onClick={()=>toggleParticipants()}
          >
            <XIcon />
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {users.map((user, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 m-2 rounded-md bg-gray-100"
          >
            {/* Initials Avatar */}
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-500 text-white font-bold">
              {getInitials(user.uid)}
            </div>

            {/* Participant Name & Status */}
            <div className="flex-1 mx-3">
              <p className="text-theme-xl font-medium">
                {user.isLocal ? "You" : `${user.uid}`}{" "}
                {raisedHands[user.uid] && "✋"}
              </p>
              <p className="text-theme-sm text-gray-400">
                {user.uid ? "joined" : "NA"}
              </p>
            </div>

            {/* Action Icons */}
            <div className="flex space-x-2 text-gray-400">
              <button className={`hover:text-blue-500 ${mutedUsers[user.uid] ? 'text-red-400' : 'text-green-400'}`}>
                {/* Mute Icon */}
                {mutedUsers[user.uid] ? <MicOffIcon /> : <MicIcon />}
              </button>
              <button className="hover:text-blue-500 text-gray-400">
                {/* More Icon */}
                <EllipsisVerticalIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
