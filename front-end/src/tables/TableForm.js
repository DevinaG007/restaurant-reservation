import React from "react";
import { useHistory } from "react-router-dom";

export default function TableForm({handleChange, handleSubmit, table}){
    const history = useHistory();

    const handleCancel = (event) => {
        event.preventDefault();
        history.go(0)
    }
    
    return (
        <>
        <main>
            <form onSubmit={handleSubmit}>
                <label htmlFor="table_name">
                    Table Name
                    <input id="table_name" name="table_name" type="text" value={table.table_name} onChange={handleChange} required/>
                </label>
                <label htmlFor="capacity">
                    Capacity
                    <input id="capacity" name="capacity" type="number" value={table.capacity} onChange={handleChange} required/>
                </label>
                <button type="submit">Submit</button>
                <button onClick={handleCancel}>Cancel</button>
            </form>
        </main>
        </>
    )
}