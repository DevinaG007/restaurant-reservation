import React from "react";
import { useHistory } from "react-router-dom";

function ReservationForm({handleSubmit, reservation, handleChange}){
    const history = useHistory();
    const cancelReservation = (event) => {
        event.preventDefault();
        history.push("/")
    }

    return (
        <main>
        <form onSubmit={handleSubmit}>
            <label htmlFor="first_name">First Name
            <input id="first_name" name="first_name" type="text" value={reservation.first_name} onChange={handleChange} required/>
            </label>
            <label htmlFor="last_name">Last Name
            <input id="last_name" name="last_name" type="text" value={reservation.last_name} onChange={handleChange} required/>
            </label>
            <label htmlFor="mobile_number">Mobile Number
            <input id="mobile_number" name="mobile_number" type="tel" value={reservation.mobile_number} onChange={handleChange} required/>
            </label>
            <label htmlFor="reservation_date">Date
            <input id="reservation_date" name="reservation_date" type="date" value={reservation.reservation_date} onChange={handleChange} required/>
            </label>
            <label htmlFor="reservation_time">Time
            <input  id="reservation_time" name="reservation_time" type="time" value={reservation.reservation_time} onChange={handleChange} required/>
            </label>
            <label htmlFor="people">Party Size
            <input id="people" name="people" type="number" value={reservation.people} onChange={handleChange} required/>
            </label>
            <button type="submit">Submit</button>
            <button onClick={cancelReservation}>Cancel</button>
        </form>
        </main>
    )
};


export default ReservationForm;