import "./App.css";
import FooterComponent from "./components/Footer/Footer";
import HeaderComponent from "./components/Header/Header";
import Homepage from "./components/Homepage/Homepage";
import { Routes, Route } from "react-router";
import { Suspense } from "react";
import NotFoundComponent from "./components/NotFound/NotFound";
import CursorTracker from "./components/CursorTracker/CursorTracker";
import ReadingProgress from "./components/ReadingProgress/ReadingProgress";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import KeyboardShortcuts from "./components/KeyboardShortcuts/KeyboardShortcuts";
import CyberpunkScanlines from "./components/CyberpunkScanlines/CyberpunkScanlines";

function App() {
  return (
    <div className="app-wrapper">
      <CyberpunkScanlines />
      <KeyboardShortcuts />
      <ReadingProgress />
      <HeaderComponent />
      <div className="app-content">
        <CursorTracker />
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Homepage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <NotFoundComponent />
              </Suspense>
            }
          />
        </Routes>
      </div>
      <FooterComponent />
      <ScrollToTop />
    </div>
  );
}

export default App;
