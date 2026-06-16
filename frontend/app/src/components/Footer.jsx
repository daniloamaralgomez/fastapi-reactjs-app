import { Copyright } from "lucide-react";

export default function Footer() {
	return (
		<footer className="border-t border-zinc-200 bg-white dark:border-zinc-900 dark:bg-zinc-950">
			<div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-6">
				<p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-500">
					<Copyright className="h-3.5 w-3.5" />
					2026 Danilo Amaral · All Rights Reserved
				</p>
			</div>
		</footer>
	);
}
