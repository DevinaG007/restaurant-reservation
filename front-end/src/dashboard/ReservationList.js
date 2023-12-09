import React from "react";
import { updateReservation } from "../utils/api";
import { useHistory } from "react-router-dom";

export default function ReservationList({ reservations }) {
  const history = useHistory();

  function displaySeatButton(reservation) {
    if (reservation.status === "booked") {
      return (
        <td>
          <a href={`/reservations/${reservation.reservation_id}/seat`}>
            <button>Seat</button>
          </a>
        </td>
      );
    }
  }

  function displayEditButton(reservation) {
    if (reservation.status === "booked") {
      return (
        <div>
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
        </div>
      );
    }
  }

  async function handleCancel(reservation) {
    if (
      window.confirm(
        `Do you want to cancel this reservation? This cannot be undone.`
      )
    ) {
      const cancelled = await updateReservation(reservation.reservation_id, "cancelled");
      if (cancelled) history.go(0);
    }
  }

  const reservationsList = reservations.map((reservation) => {
    if (reservation.status !== "finished") {
      return (
        <>
          <tr key={reservation.reservation_id}>
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
        </>
      );
    }
  });

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Reservation Date</th>
            <th>Reservation Time</th>
            <th>Mobile Number</th>
            <th>Party Size</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{reservationsList}</tbody>
      </table>
    </>
  );
}
