import { View } from "@adobe/react-spectrum";
import "./App.css";
import FooterComponent from "./components/Footer/Footer";
import HeaderComponent from "./components/Header/Header";
import Homepage from "./components/Homepage/Homepage";
import { Routes, Route } from "react-router";
import { Suspense } from "react";
import NotFoundComponent from "./components/NotFound/NotFound";

function App() {
  return (
    <>
      <HeaderComponent />
      <View UNSAFE_className="app-content" backgroundColor="gray-100">
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
      </View>
      <FooterComponent />
    </>
  );
}

export default App;
