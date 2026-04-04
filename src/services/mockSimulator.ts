import { useTelemetryStore } from '@/store/telemetryStore';
import type { TTelemetryFrame } from '@/types/telemetry';

let interval: number | null = null;

// initial state for the drift logic
const state = {
	speed: 84,
	temp: 82,
	pressure: 6.2,
	fuel: 750,
};

const generateFrame = (): TTelemetryFrame => {
	state.speed += (Math.random() - 0.5) * 2;
	state.temp += (Math.random() - 0.5) * 0.5;
	state.pressure += (Math.random() - 0.5) * 0.1;
	state.fuel -= 0.01; // constant fuel consumption

	return {
		ts: Date.now(),
		connection: 'online',
		raw: {
			speed: state.speed + 1,
			temp: state.temp + 2,
			pressure: state.pressure + 0.1,
			fuel: state.fuel,
		},
		effective: {
			speed: Math.round(state.speed),
			temp: Math.round(state.temp),
			pressure: Number(state.pressure.toFixed(1)),
			fuel: Math.round(state.fuel),
		},
		quality: { speed: 'ok', temp: 'ok', pressure: 'ok', fuel: 'ok' },
		alerts:
			state.temp > 85
				? [
						{
							code: 'ERR_TEMP_HIGH',
							severity: 'critical',
							message: 'Тяговый двигатель #3: перегрев',
						},
					]
				: [],
		healthIndex: {
			score: 94,
			grade: 'A',
			factors: [
				{ name: 'Двигатели', contribution: 98 },
				{ name: 'Тормоза', contribution: 85 },
			],
		},
	};
};

export const startMockSimulator = () => {
	if (interval) return;

	const { setConnectionStatus, pushFrame } = useTelemetryStore.getState();
	setConnectionStatus('online');

	interval = window.setInterval(() => {
		pushFrame(generateFrame());
	}, 1000);

	console.log('mock simulator started');
};

export const stopMockSimulator = () => {
	if (interval) {
		clearInterval(interval);
		interval = null;
	}
};
