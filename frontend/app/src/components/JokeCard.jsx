import { AnimatePresence, motion } from "framer-motion";
import { Heart, Quote, Terminal, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { getRandomJoke } from "../services/jokeService";
import { saveJoke } from "../services/savedJokesService";

export default function JokeCard() {
	const [joke, setJoke] = useState(null);
	const [loading, setLoading] = useState(false);
	const [saved, setSaved] = useState(false);

	async function fetchJoke() {
		if (loading) return;

		try {
			setLoading(true);

			const data = await getRandomJoke();

			setSaved(false);
			setJoke(data);
		} catch (error) {
			console.error("Failed to fetch joke:", error);
		} finally {
			setLoading(false);
		}
	}

	async function handleSave() {
		if (!joke) return;

		try {
			await saveJoke(joke);
			setSaved(true);
		} catch (error) {
			console.error("Failed to save joke:", error);
		}
	}

	// [TODO]: Populate the first Joke. Workaround to fix.
	useEffect(() => {
		fetchJoke();
	}, []);

	return (
		<div className="mx-auto w-full max-w-5xl">
			<div className="group relative rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-2xl shadow-orange-950/5 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/30 dark:border-zinc-800 dark:bg-zinc-900/40">
				{/* Header */}
				<div className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
					<div className="flex gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
						<div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
						<div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
					</div>

					<Terminal className="h-4 w-4 text-zinc-400 transition-colors duration-300 group-hover:text-orange-500 dark:text-zinc-600" />
				</div>

				{/* Warning Area (small reserved space, no ugly box) */}
				<div className="mb-3 min-h-[28px]">
					{joke && !joke.safe && (
						<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-red-500">
							<TriangleAlert className="h-3.5 w-3.5" />
							Sensitive Content
						</div>
					)}
				</div>

				{/* Joke Content */}
				<div className="relative min-h-[160px] overflow-hidden">
					<AnimatePresence mode="wait">
						{joke && (
							<motion.div
								key={joke.id}
								initial={{ x: 120, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								exit={{ x: -120, opacity: 0 }}
								transition={{
									duration: 0.45,
									ease: [0.22, 1, 0.36, 1],
								}}
								className="absolute inset-0"
							>
								<div className="flex flex-col gap-5">
									<Quote className="h-8 w-8 text-orange-500/40" />

									<p className="text-left text-xl font-medium leading-relaxed text-zinc-800 md:text-2xl dark:text-zinc-200">
										{joke.value}
									</p>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{!joke && (
						<div className="flex h-full items-center justify-center">
							<p className="animate-pulse text-zinc-500 dark:text-zinc-400">
								Loading Chuck Norris wisdom...
							</p>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="mt-6 flex items-center justify-between border-t border-zinc-200 pt-5 dark:border-zinc-800">
					<button
						onClick={handleSave}
						className="
							flex items-center gap-2
							rounded-xl
							px-4 py-3
							text-sm font-semibold
							text-zinc-700
							transition-all duration-200
							hover:bg-red-500/10
							hover:text-red-500
							dark:text-zinc-300
						"
					>
						<motion.div
							animate={
								saved
									? {
											scale: [1, 1.35, 1],
										}
									: {}
							}
							transition={{
								duration: 0.35,
							}}
						>
							<Heart
								className={`h-5 w-5 transition-colors ${
									saved ? "fill-red-500 text-red-500" : ""
								}`}
							/>
						</motion.div>

						<span>{saved ? "Saved" : "Save"}</span>
					</button>

					<button
						onClick={fetchJoke}
						disabled={loading}
						className={`rounded-xl px-6 py-3 text-sm font-semibold shadow-lg transition-all duration-200 ${
							loading
								? "cursor-not-allowed bg-zinc-400 text-white opacity-60"
								: "bg-zinc-900 text-white hover:bg-orange-500 dark:bg-zinc-100 dark:text-zinc-950"
						}`}
					>
						{loading ? "Loading..." : "Next Fact →"}
					</button>
				</div>
			</div>
		</div>
	);
}
