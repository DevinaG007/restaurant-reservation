import React from "react";
import { useHistory } from "react-router-dom";
import "../reservations/ReservationForm.css";

export default function TableForm({handleChange, handleSubmit, table}){
    const history = useHistory();
 
    return (
        <>
        <main>
            <form className="table" onSubmit={handleSubmit}>
                <label htmlFor="table_name">
                    Table Name
                    <input id="table_name" name="table_name" type="text" value={table.table_name} onChange={handleChange} required/>
                </label>
                <label htmlFor="capacity">
                    Capacity
                    <input id="capacity" name="capacity" type="number" value={table.capacity} onChange={handleChange} required/>
                </label>
                <button type="submit">Submit</button>
                <button onClick={() => history.go(-1)}>Cancel</button>
            </form>
        </main>
        </>
    )
}