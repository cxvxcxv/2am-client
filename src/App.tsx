import { useWebSocket } from '@/hooks/useWebSocket';
import clsx from 'clsx';
import { TrainFront } from 'lucide-react';

export function App() {
	const { status } = useWebSocket();

	return (
		<div className='flex flex-col'>
			<header className='px-6 py-4 border-b bg-card border-card-border flex justify-between items-center font-mono'>
				<div className='flex items-center gap-3'>
					<span className='text-primary p-2 rounded-lg border bg-primary/20 shadow-primary border-primary'>
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

			<main className='flex-1 p-6'>main content</main>
		</div>
	);
}
