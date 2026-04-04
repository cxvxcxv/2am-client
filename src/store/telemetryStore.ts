import { create } from 'zustand';
import { MAX_HISTORY_LENGTH } from '../config/constants';
import { type TTelemetryFrame } from '../types/telemetry';

interface TelemetryState {
	currentFrame: TTelemetryFrame | null;
	history: TTelemetryFrame[];
	connectionStatus:
		| 'connecting'
		| 'online'
		| 'reconnecting'
		| 'offline'
		| 'stale';
	replayMode: boolean;
	replayIndex: number;

	pushFrame: (frame: TTelemetryFrame) => void;
	setConnectionStatus: (status: TelemetryState['connectionStatus']) => void;
	setReplayMode: (bool: boolean) => void;
	setReplayIndex: (index: number) => void;
	clearHistory: () => void;
}

export const useTelemetryStore = create<TelemetryState>(set => ({
	currentFrame: null,
	history: [],
	connectionStatus: 'connecting',
	replayMode: false,
	replayIndex: 0,

	pushFrame: frame =>
		set(state => {
			const newHistory = [...state.history, frame];
			if (newHistory.length > MAX_HISTORY_LENGTH) {
				newHistory.shift();
			}
			return {
				currentFrame: frame,
				history: newHistory,
			};
		}),

	setConnectionStatus: status => set({ connectionStatus: status }),
	setReplayMode: replayMode => set({ replayMode }),
	setReplayIndex: replayIndex => set({ replayIndex }),
	clearHistory: () => set({ history: [], currentFrame: null }),
}));
