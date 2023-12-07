import { React, useState } from "react";
import { useHistory } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function CreateReservation() {
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };
  const [reservation, setReservation] = useState(initialFormState);
  const [reservationError, setReservationError] = useState(null);
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    reservation.people = Number(reservation.people); 
    try {
      let created = await createReservation(reservation);
      if (created){
        history.push(`/dashboard?date=${reservation.reservation_date}`)
        history.go(0)
     }
    } catch(error){
      setReservationError(error)
    }
  };

  const handleChange = ({ target }) => {
    const value = target.value;
    setReservation({
      ...reservation,
      [target.name]: value,
    });
  };

  return (
    <>
      <h3>Create New Reservation</h3>
      <ErrorAlert error={reservationError} />
      <ReservationForm
        handleSubmit={handleSubmit}
        reservation={reservation}
        handleChange={handleChange}
      />
    </>
  );
}
