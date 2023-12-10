import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";
import "./Menu.css"

import "./Layout.css";

/**
 * Defines the main layout of the application.
 * col-md-2 side-bar
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div className="layout">
    <div className="">
      <div className="">
        <div className="side-bar">
          <Menu />
        </div>
        <div className="">
          <Routes />
        </div>
      </div>
    </div>
    </div>
  );
}

export default Layout;
