import "./App.css";
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";

function App() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
