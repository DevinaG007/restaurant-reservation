import React from "react";

export default function ReservationList({ reservations }) {

  function displaySeatButton(reservation){
    if (reservation.status === "booked" ) {
      return (
      <td>
      <a href={`/reservations/${reservation.reservation_id}/seat`}>
        <button>
          Seat
        </button>
      </a>
    </td> 
)
}
  }

  const reservationsList = reservations.map((reservation) => {
    if (reservation.status !== "finished") {
    return (
    <>
      <tr key={reservation.id}>
        <td>{reservation.first_name}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.reservation_date}</td>
        <td>{reservation.reservation_time}</td>
        <td>{reservation.mobile_number}</td>
        <td>{reservation.people}</td>
        <td data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </td>
        {displaySeatButton(reservation)}
      </tr>
    </>
  )}
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
