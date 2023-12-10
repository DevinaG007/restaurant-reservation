import { React, useState } from "react";
import { useHistory } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import "./ReservationForm.css";


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
    const abortController = new AbortController();
    try {
      let created = await createReservation(reservation, abortController.signal);
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
      <div className="justify-content">
      <h3>Create New Reservation</h3>
      <ErrorAlert error={reservationError} />
      <ReservationForm
        handleSubmit={handleSubmit}
        reservation={reservation}
        handleChange={handleChange}
      />
      </div>
    </>
  );
}
