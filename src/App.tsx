import "./App.css";
import { Suspense } from "react";
import { Routes, Route } from "react-router";

import CursorTracker from "./components/CursorTracker/CursorTracker";
import CyberpunkScanlines from "./components/CyberpunkScanlines/CyberpunkScanlines";
import FooterComponent from "./components/Footer/Footer";
import HeaderComponent from "./components/Header/Header";
import Homepage from "./components/Homepage/Homepage";
import KeyboardShortcuts from "./components/KeyboardShortcuts/KeyboardShortcuts";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import NotFoundComponent from "./components/NotFound/NotFound";
import ReadingProgress from "./components/ReadingProgress/ReadingProgress";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import BlogList from "./components/BlogList/BlogList";
import BlogPostLayout from "./components/BlogPost/BlogPostLayout";

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
            path="/loading"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <LoadingSpinner />
              </Suspense>
            }
          />
          <Route
            path="/blog"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <BlogList />
              </Suspense>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <BlogPostLayout />
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
