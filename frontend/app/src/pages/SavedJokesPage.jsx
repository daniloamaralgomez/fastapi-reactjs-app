import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";

import Footer from "../components/Footer";
import Header from "../components/Header";
import SavedJokeCard from "../components/SavedJokeCard";

import { getSavedJokes, removeJoke } from "../services/savedJokesService";

export default function SavedJokesPage() {
	const [jokes, setJokes] = useState([]);

	useEffect(() => {
		loadJokes();
	}, []);

	async function loadJokes() {
		try {
			const data = await getSavedJokes();
			setJokes(data);
		} catch (error) {
			console.error(error);
		}
	}

	async function handleDelete(id) {
		try {
			await removeJoke(id);

			setJokes((current) => current.filter((joke) => joke.id !== id));
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
			<div className="absolute top-0 left-1/2 -z-10 h-[400px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.12),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.07),transparent_50%)]" />

			<Header />

			<main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
				<div className="mb-10 text-center">
					<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-medium text-orange-600 dark:text-orange-400">
						<Bookmark className="h-3.5 w-3.5" />
						Persistent Storage
					</div>

					<h1 className="bg-gradient-to-b from-zinc-900 via-zinc-700 to-zinc-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl dark:from-zinc-50 dark:via-zinc-200 dark:to-zinc-500">
						Saved Jokes
					</h1>

					<p className="mt-4 text-zinc-600 dark:text-zinc-400">
						Your personal collection of Chuck Norris facts.
					</p>
				</div>

				{jokes.length === 0 ? (
					<div className="rounded-3xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-800">
						<p className="text-zinc-500 dark:text-zinc-400">
							No saved jokes yet.
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-4">
						{jokes.map((joke) => (
							<SavedJokeCard
								key={joke.id}
								joke={joke}
								onDelete={handleDelete}
							/>
						))}
					</div>
				)}
			</main>

			<Footer />
		</div>
	);
}
