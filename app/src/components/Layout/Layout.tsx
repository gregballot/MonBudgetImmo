import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import "./Layout.scss";

const Layout: React.FC = () => (
  <div className="layout-container">
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
