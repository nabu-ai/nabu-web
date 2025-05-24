'use client';

import { useMeetingStore } from '@/store/useMeetingStore';

export default function ParticipantsPanel({ localUid, localName, remoteUsers }: { localUid: string; localName: string, remoteUsers: any[] }) {
  const isParticipantsOpen = useMeetingStore((s) => s.isParticipantsOpen);
  const raisedHands = useMeetingStore((s) => s.raisedHands);
  const muted = useMeetingStore((s) => s.muted);

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

  return (
    <div className="fixed right-0 top-0 h-full w-full sm:w-80 bg-white text-black shadow-lg z-40 flex flex-col border-l">
      <div className="p-4 border-b font-semibold">Participants</div>
      <div className="p-4 space-y-3">
        {users.map((user) => (
          <div key={user.uid} className="flex justify-between items-center">
            <span>
              {user.isLocal ? 'You' : `${user.name}`} {raisedHands[user.uid] && '✋'}
            </span>
            <span>{user.muted ? '🔇' : '🎙️'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
