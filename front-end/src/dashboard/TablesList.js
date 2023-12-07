import React from "react";
import {useHistory} from "react-router-dom";
import {listTables, deleteReservation} from "../utils/api";

export default function TablesList({ tables }) {
  const history = useHistory();
  const listOfTables = tables.map((table) => (
    <tr>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>{table.reservation_id ? "Occupied" : "Free"}</td>
        <td><button data-table-id-finish={table.table_id} onClick={() => finishReservation(table)}>Finish</button></td>
    </tr>
  ));

  function finishReservation(table){
    if (
    window.confirm("Is this table ready to seat new guests? This cannot be undone.")
    ){
      deleteReservation(table)
      .then(() => listTables())
      .then(history.go(0))
    } else {
      history.go(0)
    }
  }

  return (
    <>
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
