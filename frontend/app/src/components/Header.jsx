import { Flame, Moon, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";

import { useTheme } from "../contexts/ThemeContext";

export default function Header() {
	const { theme, toggleTheme } = useTheme();

	const navClass = ({ isActive }) =>
		`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
			isActive
				? "text-orange-500"
				: "text-zinc-600 hover:bg-zinc-100 hover:text-orange-500 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-orange-400"
		}`;

	return (
		<header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/70 backdrop-blur-md dark:border-zinc-900 dark:bg-zinc-950/70">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
				<div className="group flex cursor-pointer items-center gap-3">
					<div className="rounded-xl bg-orange-500/10 p-2 text-orange-500">
						<Flame className="h-5 w-5" />
					</div>

					<span className="font-bold tracking-tight">Norris Hub</span>
				</div>

				<nav className="flex items-center gap-3">
					<NavLink to="/" className={navClass}>
						Jokes
					</NavLink>

					<NavLink to="/saved" className={navClass}>
						Saved
					</NavLink>

					<button
						onClick={toggleTheme}
						className="rounded-lg border border-zinc-300 p-2 dark:border-zinc-800"
					>
						{theme === "dark" ? (
							<Sun className="h-4 w-4" />
						) : (
							<Moon className="h-4 w-4" />
						)}
					</button>
				</nav>
			</div>
		</header>
	);
}
