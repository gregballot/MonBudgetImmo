import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import Performance from "../Performance/Performance";
import "./Layout.scss";

const Layout: React.FC = () => (
  <div className="layout-container">
    <Performance />
    <Header />
    <main className="main-content">
      <div className="content-wrapper">
        <Outlet />
      </div>
    </main>
    <Footer />
  </div>
);

export default Layout; 
