import { useWebSocket } from '@/hooks/useWebSocket';
import clsx from 'clsx';
import { TrainFront } from 'lucide-react';
import { startMockSimulator } from './services/mockSimulator';

// todo: placeholder components - swap later
const HealthIndex = () => (
	<div className='h-1/3 bg-card border border-card-border rounded-lg'>
		Health Index
	</div>
);
const AlertsPanel = () => (
	<div className='flex-1 bg-card border border-card-border rounded-lg overflow-hidden'>
		Alerts
	</div>
);
const MetricGauges = () => (
	<div className='h-48 grid grid-cols-4 gap-4'>
		<div className='bg-card border border-card-border rounded-lg'>Speed</div>
		<div className='bg-card border border-card-border rounded-lg'>Temp</div>
		<div className='bg-card border border-card-border rounded-lg'>Pressure</div>
		<div className='bg-card border border-card-border rounded-lg'>Fuel</div>
	</div>
);
const TrendsPanel = () => (
	<div className='flex-1 min-h-64 bg-card border border-card-border rounded-lg'>
		Trends Chart
	</div>
);
const ReplayControls = () => (
	<div className='h-16 bg-card border border-card-border rounded-lg'>
		Replay Scrubber
	</div>
);

export function App() {
	const { status } = useWebSocket();

	if (import.meta.env.VITE_USE_MOCK === 'true') {
		startMockSimulator();
	}

	return (
		<div className='flex flex-col'>
			<header className='px-6 py-4 border-b bg-card border-card-border flex justify-between items-center font-mono'>
				<div className='flex items-center gap-3'>
					<span className='text-primary p-2 rounded-lg border bg-primary/20 border-primary'>
						<TrainFront />
					</span>
					<h1 className='text-xl font-bold tracking-tighter'>
						KZ8A <span className='text-muted text-sm font-normal'>#0001</span>
					</h1>
				</div>

				<div className='flex items-center gap-3'>
					<div
						className={clsx('h-2 w-2 rounded-full', {
							'bg-secondary animate-pulse': status === 'online',
							'bg-warning': status === 'reconnecting',
							'bg-critical': status === 'offline',
						})}
					/>
					<span className='font-mono text-xs uppercase tracking-widest'>
						System: {status}
					</span>
				</div>
			</header>

			<main className='flex-1 grid grid-cols-4 gap-4 p-6'>
				<aside className='col-span-1 flex flex-col gap-4 overflow-hidden'>
					<HealthIndex />
					<AlertsPanel />
				</aside>
				<section className='col-span-3 flex flex-col gap-4 overflow-hidden'>
					<MetricGauges />
					<TrendsPanel />
					<ReplayControls />
				</section>
			</main>
		</div>
	);
}
