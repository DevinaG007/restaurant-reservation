import React from "react";
import "./Menu.css"
import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

        /* <div className="text-center d-none d-md-inline">
          <button
            className="btn rounded-circle border-0"
            id="sidebarToggle"
            type="button"
          />
        </div> */

function Menu() {
  return (
    <>
        <Link
          className=""
          to="/"
        >
          <div className="title">
            <h1>Periodic Tables</h1>
          </div>
        </Link>
        <ul className="menu" id="accordionSidebar">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">
              {/* <span className="oi oi-dashboard" /> */}
              &nbsp;Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/search">
              {/* <span className="oi oi-magnifying-glass" /> */}
              &nbsp;Search
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/reservations/new">
              {/* <span className="oi oi-plus" /> */}
              &nbsp;New Reservation
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/tables/new">
              {/* <span className="oi oi-layers" /> */}
              &nbsp;New Table
            </Link>
          </li>
        </ul>
    </>
  );
}

export default Menu;
