export type TMetricQuality = 'ok' | 'stale' | 'invalid' | 'outlier';

export type TTelemetryFrame = {
	ts: number;
	connection: 'online' | 'degraded';
	raw: {
		temp?: number;
		pressure?: number;
		fuel?: number;
		speed?: number;
	};
	effective: {
		temp?: number;
		pressure?: number;
		fuel?: number;
		speed?: number;
	};
	quality: {
		temp?: TMetricQuality;
		pressure?: TMetricQuality;
		fuel?: TMetricQuality;
		speed?: TMetricQuality;
	};
	alerts: Array<{
		code: string;
		severity: 'info' | 'warning' | 'critical';
		message: string;
	}>;
	healthIndex: {
		score: number;
		grade: 'A' | 'B' | 'C' | 'D' | 'E';
		factors: Array<{ name: string; contribution: number }>;
	};
};
