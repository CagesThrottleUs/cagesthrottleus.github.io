import "./App.css";
import FooterComponent from "./components/Footer/Footer";
import HeaderComponent from "./components/Header/Header";
import Homepage from "./components/Homepage/Homepage";
import { Routes, Route } from "react-router";
import { Suspense } from "react";
import NotFoundComponent from "./components/NotFound/NotFound";
import CursorTracker from "./components/CursorTracker/CursorTracker";

function App() {
  return (
    <div className="app-wrapper">
      <HeaderComponent />
      <div className="app-content">
        <CursorTracker />
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Homepage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <NotFoundComponent />
              </Suspense>
            }
          />
        </Routes>
      </div>
      <FooterComponent />
    </div>
  );
}

export default App;
