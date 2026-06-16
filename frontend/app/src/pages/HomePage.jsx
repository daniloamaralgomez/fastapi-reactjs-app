import { Sparkles } from "lucide-react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import JokeCard from "../components/JokeCard";

export default function HomePage() {
	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
			<div className="absolute top-0 left-1/2 -z-10 h-[400px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.12),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.07),transparent_50%)]" />

			<Header />

			<main className="flex flex-1 flex-col">
				<div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-8 text-center">
					<div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-medium text-orange-600 dark:text-orange-400">
						<Sparkles className="h-3.5 w-3.5" />
						Ultimate Power Delivered Instantly
					</div>

					<h1 className="max-w-3xl bg-gradient-to-b from-zinc-900 via-zinc-700 to-zinc-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-6xl dark:from-zinc-50 dark:via-zinc-200 dark:to-zinc-500">
						Chuck Norris Jokes
					</h1>

					<p className="mt-4 max-w-lg text-base text-zinc-600 md:text-lg dark:text-zinc-400">
						The definitive source for factual alternative history.
					</p>
				</div>

				<div className="flex flex-1 items-center justify-center px-6 py-6">
					<JokeCard />
				</div>
			</main>

			<Footer />
		</div>
	);
}
