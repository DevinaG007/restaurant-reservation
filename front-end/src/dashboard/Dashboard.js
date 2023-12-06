import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "./ReservationList";
import TablesList from "./TablesList";
import { useLocation } from "react-router-dom";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, tables, tablesError }) {
  let location = useLocation();
  const query = location.search;
  if (query) {
    const queryParams = new URLSearchParams(query);
    const newDate = queryParams.get("date");
    date = newDate;
  }

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  // const [tables, setTables] = useState([]);
  // const [tablesError, setTablesError] = useState([]);

  useEffect(loadDashboard, [date]);
  // useEffect(loadTables);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  // function loadTables(){
  //   const abortController = new AbortController();
  //   setReservationsError(null);
  //   listTables(abortController.signal)
  //   .then(setTables)
  //   .catch(setTablesError);
  //   return () => abortController.abort();
  // }



  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      {/* {JSON.stringify(reservations)} */}
      <ReservationList reservations={reservations} date={date} tables={tables}/>
      <TablesList tables={tables}/>
    </main>
  );
}

export default Dashboard;
