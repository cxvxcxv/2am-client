import {
	RECONNECT_BACKOFF,
	WS_HEARTBEAT_INTERVAL,
	WS_STALE_THRESHOLD,
} from '@/config/constants';
import { useTelemetryStore } from '@/store/telemetryStore';
import type { TTelemetryFrame } from '@/types/telemetry';

class TelemetryWsClient {
	private socket: WebSocket | null = null;
	private url: string;
	private reconnectAttempt = 0;
	private heartbeatTimer?: number;
	private staleTimer?: number;
	private lastMessageAt = 0;

	constructor(url: string) {
		this.url = url;
	}

	connect() {
		const { setConnectionStatus } = useTelemetryStore.getState();

		try {
			this.socket = new WebSocket(this.url);

			this.socket.onopen = () => {
				console.log('WS Connected');
				this.reconnectAttempt = 0;
				setConnectionStatus('online');
				this.startHeartbeat();
				this.resetStaleTimer();
			};

			this.socket.onmessage = event => {
				const data = JSON.parse(event.data);

				// handle telemetry frames
				if (data.ts) {
					this.lastMessageAt = Date.now();
					useTelemetryStore.getState().pushFrame(data as TTelemetryFrame);
					this.resetStaleTimer();
				}
			};

			this.socket.onclose = () => {
				this.cleanup();
				this.attemptReconnect();
			};

			this.socket.onerror = err => {
				console.error('WS Error:', err);
				this.socket?.close();
			};
		} catch (error) {
			console.error(error);
			this.attemptReconnect();
		}
	}

	private attemptReconnect() {
		const { setConnectionStatus } = useTelemetryStore.getState();

		if (this.reconnectAttempt >= RECONNECT_BACKOFF.length) {
			setConnectionStatus('offline');
			return;
		}

		setConnectionStatus('reconnecting');
		const delay = RECONNECT_BACKOFF[this.reconnectAttempt];
		const jitter = Math.random() * 300;
		this.reconnectAttempt++;

		setTimeout(() => {
			this.connect();
		}, delay + jitter);
	}

	private startHeartbeat() {
		this.heartbeatTimer = window.setInterval(() => {
			if (this.socket?.readyState === WebSocket.OPEN) {
				this.socket.send(JSON.stringify({ type: 'ping', ts: Date.now() }));
			}
		}, WS_HEARTBEAT_INTERVAL);
	}

	private resetStaleTimer() {
		window.clearTimeout(this.staleTimer);
		this.staleTimer = window.setTimeout(() => {
			const now = Date.now();
			if (now - this.lastMessageAt > WS_STALE_THRESHOLD) {
				useTelemetryStore.getState().setConnectionStatus('stale');
			}
		}, WS_STALE_THRESHOLD);
	}

	private cleanup() {
		window.clearInterval(this.heartbeatTimer);
		window.clearTimeout(this.staleTimer);
	}

	disconnect() {
		this.cleanup();
		this.socket?.close();
	}
}

export const wsClient = new TelemetryWsClient(
	import.meta.env.VITE_WS_URL || 'ws://localhost:8080',
);
