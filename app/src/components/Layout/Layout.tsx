import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import "./Layout.scss";

const Layout: React.FC = () => (
  <>
    <Header />
    <div className="main-inner">
      <div className="app-content">
        <Outlet />
      </div>
    </div>
    <Footer />
  </>
);

export default Layout; 
