import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PublicLayout = ({ theme, setTheme, dotRef, outlineRef }) => {
  return (
    <div className="dark:bg-black relative cursor-none [&_*]:cursor-none">
      <Navbar theme={theme} setTheme={setTheme} />

      <Outlet />

      <Footer theme={theme} />

      {/* Custom Cursor Outline */}
      <div
        ref={outlineRef}
        className="fixed top-0 left-0 h-10 w-10 rounded-full border pointer-events-none z-[9999]"
        style={{
          borderColor: theme === "dark" ? "#00ff00" : "#008000",
          transition: "border-color 0.2s, transform 0.1s ease-out",
        }}
      />

      {/* Custom Cursor Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-3 w-3 rounded-full pointer-events-none z-[9999]"
        style={{
          backgroundColor: theme === "dark" ? "#00ff00" : "#008000",
          transition: "background-color 0.2s, transform 0.1s ease-out",
        }}
      />
    </div>
  );
};

export default PublicLayout;

