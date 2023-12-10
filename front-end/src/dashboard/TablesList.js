import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import { deleteReservation, updateReservation} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import "./TablesList.css";

//Displays list of tables on Dashboard

export default function TablesList({ tables }) {
  const history = useHistory();
  const [tableError, setTableError] = useState(null);

  const listOfTables = tables.map((table) => (
    <tr key={table.table_id} className="tables">
        <td className="tables">{table.table_name}</td>
        <td className="tables">{table.capacity}</td>
        <td className="tables" data-table-id-status={table.table_id}>{table.reservation_id ? "Occupied" : "Free"}</td>
        <td className="tables"><button data-table-id-finish={table.table_id} onClick={() => finishReservation(table)}>Finish</button></td>
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
      <table className="tables justify-table">
        <thead className="tables">
          <tr className="tables">
            <th className="tables">Table Name</th>
            <th className="tables">Capacity</th>
            <th className="tables">Status</th>
            <th className="tables">Finish</th>
          </tr>
        </thead>
        <tbody className="tables">
          {listOfTables}
        </tbody>
      </table>
    </>
  );
}
