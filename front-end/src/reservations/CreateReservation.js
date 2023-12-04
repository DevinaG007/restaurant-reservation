import { React, useState } from "react";
import { useHistory } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import { createReservation } from "../utils/api";

export default function CreateReservation() {
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1
  };
  const [reservation, setReservation] = useState(initialFormState);

  const history = useHistory();

  const handleSubmit = ( event ) => {
    event.preventDefault();
    createReservation(reservation)
    // .then(history.push("/")).then(history.go(0));
  };


  const handleChange = ({target}) => {
    const value = target.value;
    setReservation({
        ...reservation, 
        [target.name]:value
    })
  }
  return (
    <>
      <h3>Create New Reservation</h3>
      <ReservationForm
        handleSubmit={handleSubmit}
        reservation={reservation}
        handleChange={handleChange}
      />
    </>
  );
}
