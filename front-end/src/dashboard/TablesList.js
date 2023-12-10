import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import { deleteReservation, updateReservation} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

//Displays list of tables on Dashboard

export default function TablesList({ tables }) {
  const history = useHistory();
  const [tableError, setTableError] = useState(null);

  const listOfTables = tables.map((table) => (
    <tr key={table.table_id}>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>{table.reservation_id ? "Occupied" : "Free"}</td>
        <td><button data-table-id-finish={table.table_id} onClick={() => finishReservation(table)}>Finish</button></td>
    </tr>
  ));

 async function finishReservation(table){
    if (
    window.confirm("Is this table ready to seat new guests? This cannot be undone.")
    ){
      try {
     const deleted = await deleteReservation(table);
      if (deleted){
        updateReservation(table.reservation_id, "finished")
        .then(history.go(0))
      }
    } catch(error){
      setTableError(error)
    }
    } else {
      history.go(0)
    }
  }

  return (
    <>
    <ErrorAlert error={tableError} />
      <table>
        <thead>
          <tr>
            <th>Table Name</th>
            <th>Capacity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {listOfTables}
        </tbody>
      </table>
    </>
  );
}
