'use client';

import { useMeetingStore } from '@/store/useMeetingStore';

export default function ControlBar({ uid }: { uid: string }) {
    const {
        raiseHand,
    } = useMeetingStore();

    const isRaised = useMeetingStore((s) => s.raisedHands[uid]);

    const muted = useMeetingStore((s) => s.muted);
    const toggleMute = useMeetingStore((s) => s.toggleMute);

    const videoEnabled = useMeetingStore((s) => s.videoEnabled);
    const toggleVideo = useMeetingStore((s) => s.toggleVideo);

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 p-3 rounded-xl shadow-lg flex gap-4">
            <button
                onClick={toggleMute}
                className={`px-4 py-2 rounded text-white ${
                muted ? 'bg-red-600' : 'bg-green-600'
                }`}
            >
                {muted ? 'Unmute' : 'Mute'}
            </button>

            <button
                onClick={toggleVideo}
                className={`px-4 py-2 rounded text-white ${
                videoEnabled ? 'bg-green-600' : 'bg-red-600'
                }`}
            >
                {videoEnabled ? 'Video On' : 'Video Off'}
            </button>

            <button
                onClick={() => raiseHand(uid)}
                className={`px-4 py-2 rounded text-white ${isRaised ? 'bg-yellow-700' : 'bg-yellow-600'}`}
                >
                {isRaised ? 'Raise Hand' : '✋ Raise Hand'}
            </button>

            <button
                onClick={() => window.location.href = '/lobby'}
                className="px-4 py-2 rounded bg-gray-600 text-white"
            >
                Leave
            </button>
        </div>
    );
}