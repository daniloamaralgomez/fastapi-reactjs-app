import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SavedJokesPage from "./pages/SavedJokesPage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/saved" element={<SavedJokesPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
