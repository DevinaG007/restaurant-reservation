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
    people: "",
  };
  const [reservation, setReservation] = useState(initialFormState);

  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(reservation)
    createReservation(reservation);
    setReservation(initialFormState);
    history.push("/");
  };
  const handleChange = ({target}) => {
    const value = target.value;
    setReservation({
        ...reservation, 
        [target.name]:value
    })
    console.log(reservation)
  }

  return (
    <>
      <ReservationForm handleSubmit={handleSubmit} reservation={reservation} handleChange={handleChange}/>
    </>
  );
}
