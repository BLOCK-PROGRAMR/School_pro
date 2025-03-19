import "./App.css";
import { useState, useContext, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { ThemeContext } from "./store/ThemeContext";
import { useViewport } from "./utils/responsive";

function App() {
  const { theme } = useContext(ThemeContext);
  const viewport = useViewport();
  
  // Set the class on the HTML element for global theme styling
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Add responsive classes to the HTML element
  useEffect(() => {
    const html = document.documentElement;
    
    // Remove all existing viewport classes
    html.classList.remove('is-mobile', 'is-tablet', 'is-desktop');
    
    // Add the appropriate viewport class
    if (viewport.isMobile) html.classList.add('is-mobile');
    if (viewport.isTablet) html.classList.add('is-tablet');
    if (viewport.isDesktop) html.classList.add('is-desktop');
  }, [viewport]);

  return (
    <div className={`app ${theme === 'dark' ? 'dark' : ''}`}>
      <Outlet />
    </div>
  );
}

export default App;
