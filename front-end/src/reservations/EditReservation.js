import React, { useState, useEffect } from "react";
import ReservationForm from "./ReservationForm";
import { readReservation, editReservation } from "../utils/api";
import formatReservationTime from "../utils/format-reservation-time";
import { useParams, useHistory, useLocation } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

export default function EditReservation() {
  const history = useHistory();
  const location = useLocation();
  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState({});
  const [reservationError, setReservationError] = useState(null);

  function loadReservation() {
    const abortController = new AbortController();
    readReservation(reservation_id, abortController.signal)
    .then(formatReservationTime)
      .then(setReservation)
      .catch(setReservationError);
    return () => abortController.abort();
  }

  useEffect(loadReservation, [reservation_id]);

  console.log(reservation)

  const handleSubmit = async (event) => {
    event.preventDefault();
    reservation.people = Number(reservation.people);
    try {
        let updated = await editReservation(reservation);
        if (updated) {
          history.push(`/dashboard?date=${reservation.reservation_date}`)
        } 
        
    } catch (error) {
      setReservationError(error);
    }
  };

  const handleChange = ({ target }) => {
    const value = target.value;
    setReservation({
      ...reservation,
      [target.name]: value,
    });
    console.log(reservation_id);
  };
  if (reservation.reservation_id) return (
    <>
      <ErrorAlert error={reservationError} />
      <ReservationForm
        handleSubmit={handleSubmit}
        reservation={reservation}
        handleChange={handleChange}
      />
    </>
  ); else {
    return "Loading..."
  }
}
