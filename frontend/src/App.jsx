import { BrowserRouter, Routes, Route } from "react-router-dom";
import Projects from "./pages/Projects";

export default function App() {
  return (
    <BrowserRouter>
      <main className="min-h-screen bg-gray-950 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <Routes>
            <Route path="/" element={<Projects />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}