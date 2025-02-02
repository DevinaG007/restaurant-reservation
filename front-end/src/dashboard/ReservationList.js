import React, { useState } from "react";
import { updateReservation } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import "./ReservationsList.css";

/*Component displays a list of
reservations on the Dashboard page */

export default function ReservationList({ reservations }) {
  const history = useHistory();
  const [reservationError, setReservationError] = useState(null);

  function displaySeatButton(reservation) {
    if (reservation.status === "booked")
      return (
        <td>
          <a href={`/reservations/${reservation.reservation_id}/seat`}>
            <button>Seat</button>
          </a>
        </td>
      );
  }

  function displayEditButton(reservation) {
    if (reservation.status === "booked") {
      return (
        <>
          <td>
            <a href={`/reservations/${reservation.reservation_id}/edit`}>
              <button>Edit</button>
            </a>
          </td>
          <td>
            <button
              data-reservation-id-cancel={reservation.reservation_id}
              onClick={() => handleCancel(reservation)}
            >
              Cancel
            </button>
          </td>
        </>
      );
    }
  }

  async function handleCancel(reservation) {
    if (
      window.confirm(
        `Do you want to cancel this reservation? This cannot be undone.`
      )
    ) {
      try {
        const cancelled = await updateReservation(
          reservation.reservation_id,
          "cancelled"
        );
        if (cancelled) history.go(0);
      } catch (error) {
        setReservationError(error);
      }
    }
  }

  const reservationsList = reservations.map((reservation) => {
    if (reservation.status !== "finished")
      return (
        <tr key={reservation.reservation_id} className="reservations">
          <td>{reservation.first_name}</td>
          <td>{reservation.last_name}</td>
          <td>{reservation.reservation_date}</td>
          <td>{reservation.reservation_time}</td>
          <td>{reservation.mobile_number}</td>
          <td>{reservation.people}</td>
          <td data-reservation-id-status={reservation.reservation_id}>
            {reservation.status}
          </td>
          {displayEditButton(reservation)}
          {displaySeatButton(reservation)}
        </tr>
      );
    else {
      return null;
    }
  });

  return (
    <>
      <ErrorAlert error={reservationError} />
      <table className="justify-reservations">
        <thead>
          <tr>
            <th className="reservations">First Name</th>
            <th className="reservations">Last Name</th>
            <th className="reservations">Reservation Date</th>
            <th className="reservations">Reservation Time</th>
            <th className="reservations">Mobile Number</th>
            <th className="reservations">Party Size</th>
            <th className="reservations">Status</th>
          </tr>
        </thead>
        <tbody>{reservationsList}</tbody>
      </table>
    </>
  );
}
