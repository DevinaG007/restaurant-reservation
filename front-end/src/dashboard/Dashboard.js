import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "./ReservationList";
import TablesList from "./TablesList";
import { useLocation, useHistory } from "react-router-dom";
import { next, previous } from "../utils/date-time";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  let location = useLocation();
  const query = location.search;
  if (query) {
    const queryParams = new URLSearchParams(query);
    const newDate = queryParams.get("date");
    date = newDate;
  }

  let history = useHistory();

  function dateHandler(date) {
    history.push(`/dashboard?date=${date}`);
    history.go(0);
  }

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(loadDashboard, [date]);
  useEffect(loadTables, []);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function loadTables(){
    const abortController = new AbortController();
    setReservationsError(null);
    listTables(abortController.signal)
    .then(setTables)
    .catch(setReservationsError);
    return () => abortController.abort();
  }



  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
      </div>
      <div>
        <button onClick={() => dateHandler(previous(date))}>Previous</button>
        <button onClick={() => history.push("/")}>Today</button>
        <button onClick={() => dateHandler(next(date))}>Next</button>
      </div>
      <ErrorAlert error={reservationsError} />
      {/* {JSON.stringify(reservations)} */}
      <ReservationList reservations={reservations} date={date} tables={tables}/>
      <TablesList tables={tables}/>
    </main>
  );
}

export default Dashboard;
