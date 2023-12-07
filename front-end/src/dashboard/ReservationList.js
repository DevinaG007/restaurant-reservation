import React from "react";
import { useHistory } from "react-router-dom";
import {next, previous} from "../utils/date-time";

export default function ReservationList({ reservations, date }) {
    let history = useHistory();


  function dateHandler(date) {
    history.push(`/dashboard?date=${date}`);
    history.go(0);
  }

  const reservationsList = reservations.map((reservation) => (
    <>
    <tr key={reservation.id}>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.people}</td>
      <td>
      <a href={`/reservations/${reservation.reservation_id}/seat`}><button>Seat</button></a></td>
    </tr>
    </>
  ));

  return (
    <>
      <div>
        <button onClick={() => dateHandler(previous(date))}>Previous</button>
        <button onClick={() => history.push("/")}>Today</button>
        <button onClick={() => dateHandler(next(date))}>Next</button>
      </div>
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
        <tbody>{reservationsList}</tbody>
      </table>
    </>
  );
}
