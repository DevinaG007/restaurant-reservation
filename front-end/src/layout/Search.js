import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ReservationList from "../dashboard/ReservationList";
import ErrorAlert from "./ErrorAlert";
import "./Search.css";

//Component renders search page

export default function Search() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [searchError, setSearchError] = useState(null);

  const changeHandler = ({ target }) => {
    setMobileNumber(target.value);
  };

  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    listReservations({ mobile_number: mobileNumber }, abortController.signal)
      .then(setReservations)
      .catch(setSearchError);
    return () => abortController.abort();
  }

  function displayReservations(reservations) {
    if (reservations.length) {
      return (
        <div>
          <ReservationList reservations={reservations} />
        </div>
      );
    } else {
      return "No reservations found.";
    }
  }

  return (
    <>
      <div className="search">
        <h3>Search for a Reservation</h3>
        <ErrorAlert error={searchError} />
        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="mobile_number">
            <input
              name="mobile_number"
              id="mobile_number"
              type="search"
              value={mobileNumber}
              onChange={changeHandler}
              placeholder="Enter a customer's phone number"
            />
          </label>
          <button type="submit" onClick={handleSubmit}>
            Find
          </button>
        </form>
        <div>
        {displayReservations(reservations)}
        </div>
      </div>
    </>
  );
}
