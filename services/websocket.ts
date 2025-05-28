import { useMeetingStore } from '@/store/useMeetingStore';

type RaiseHandHandler = (uid: string, raised: boolean) => void;
type ChatHandler = (uid: string, text: string) => void;
type MuteHandler = (uid: string, mute: boolean) => void;
type TranscriptHandler = (uid: string, text: string, sourceLanguage: string, audioHeardAs: string) => void;

let socket: WebSocket | null = null;

const raiseHandListeners: Set<RaiseHandHandler> = new Set();
const chatListeners: Set<ChatHandler> = new Set();
const muteListeners: Set<MuteHandler> = new Set();
const transcriptListeners: Set<TranscriptHandler> = new Set();

export function connectWebSocket(roomId: string, uid: string): WebSocket | null {
    if (socket) return socket;

    socket = new WebSocket(`ws://localhost:5001?room=${roomId}&uid=${uid}`);

    socket.onopen = () => {
        console.log(`[NABU WS] Connected to room ${roomId}`);
    };

    socket.onerror = (err) => {
        console.error('[NABU WS] WebSocket error', err);
    };

    socket.onclose = () => {
        console.warn('[NABU WS] Disconnected');
        socket = null;
    };

    socket.onmessage = (event) => {
        try {
            const msg = JSON.parse(event.data);

            if (msg.type === 'hand') {
                raiseHandListeners.forEach((cb) => cb(msg.uid, msg.raised));
            } else if (msg.type === 'chat') {
                chatListeners.forEach((cb) => cb(msg.uid, msg.text));
            } else if (msg.type === 'mute') {
                muteListeners.forEach((cb) => cb(msg.uid, msg.muted));
            }
            else if (msg.type === 'transcript') {
                const store = useMeetingStore.getState();
                store.setActiveSpeaker(msg.uid)
                transcriptListeners.forEach((cb) => cb(msg.uid, msg.transcript, msg.sourceLanguage, msg.audioHeardAs));
            }
            else if (msg.type === 'room-state') {
                // ✅ Handle room-state sync for late joiners
                const { raisedHands, mutedUsers } = msg;

                const store = useMeetingStore.getState();

                Object.entries(raisedHands || {}).forEach(([uid, raised]) => {
                    store.setHandState(uid, raised as boolean);
                });

                Object.entries(mutedUsers || {}).forEach(([uid, muted]) => {
                    store.setMuteState(uid, muted as boolean);
                });
            }
        } catch (err) {
            console.warn('[NABU WS] Invalid message', event.data);
        }
    };

    return socket;
}

export function sendRaiseHand(uid: string, raised: boolean) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: 'hand', uid, raised }));
}

export function sendChatMessage(uid: string, text: string) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: 'chat', uid, text }));
}

export function sendMute(uid: string, muted: boolean) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: 'mute', uid, muted }));
}

export function sendTranscript(uid: string, transcript: string, sourceLanguage:string, audioHeardAs: string) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: 'transcript', uid, transcript, sourceLanguage, audioHeardAs}));
}

export function onRaiseHand(cb: RaiseHandHandler): () => void {
    raiseHandListeners.add(cb);
    return () => {
        raiseHandListeners.delete(cb); // prevent memory leak
    };
}

export function onChat(cb: ChatHandler): () => void {
    chatListeners.add(cb);
    return () => {
        chatListeners.delete(cb);
    };
}

export function onMute(cb: MuteHandler): () => void {
    muteListeners.add(cb);
    return () => {
        muteListeners.delete(cb); // prevent memory leak
    };
}

export function onTranscript(cb: TranscriptHandler): () => void {
    transcriptListeners.add(cb);
    return () => {
        transcriptListeners.delete(cb); // prevent memory leak
    };
}
