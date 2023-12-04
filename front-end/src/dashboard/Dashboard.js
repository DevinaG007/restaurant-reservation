import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useLocation, useHistory } from "react-router-dom";
import {next, previous} from "../utils/date-time";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  let location = useLocation();
  let history = useHistory();
  const query = location.search;
  if (query){
  const queryParams = new URLSearchParams(query)
  const newDate = queryParams.get("date")
  date = newDate;
 }

 function dateHandler(date){
  history.push(`/dashboard?date=${date}`)
  history.go(0)
 }

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const reservationsList = reservations.map(((reservation) => (
    <tr key={reservation.id}>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.people}</td>
    </tr>
  )))

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
      </div>
      <div>
        <button onClick={() => dateHandler(previous(date))}>Previous</button>
        <button onClick={()=> history.push("/")}>Today</button>
        <button onClick={() => dateHandler(next(date))}>Next</button>
      </div>
      <ErrorAlert error={reservationsError} />
      {/* {JSON.stringify(reservations)} */}
      <table>
        <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Reservation Date</th>
          <th>Reservation Time</th>
          <th>Mobile Number</th>
          <th>Party Size</th>
        </tr>
        </thead>
        <tbody>
        {reservationsList}
        </tbody>
      </table>
    </main>
  );
}

export default Dashboard;
