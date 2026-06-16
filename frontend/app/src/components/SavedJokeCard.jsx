import { Quote, Trash2 } from "lucide-react";

export default function SavedJokeCard({ joke, onDelete }) {
	return (
		<div className="group rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-lg shadow-orange-950/5 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/30 dark:border-zinc-800 dark:bg-zinc-900/40">
			<div className="flex items-start justify-between gap-6">
				<div className="flex-1">
					<Quote className="mb-4 h-6 w-6 text-orange-500/40" />

					<p className="text-lg leading-relaxed text-zinc-800 dark:text-zinc-200">
						{joke.value}
					</p>
				</div>

				<button
					onClick={() => onDelete(joke.id)}
					className="rounded-xl p-3 text-zinc-400 transition-all hover:bg-red-500/10 hover:text-red-500"
				>
					<Trash2 className="h-5 w-5" />
				</button>
			</div>
		</div>
	);
}
