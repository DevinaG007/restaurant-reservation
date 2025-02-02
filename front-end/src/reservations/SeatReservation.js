import React, {useState, useEffect} from "react";
import { useHistory, useParams } from "react-router-dom";
import { updateTable } from "../utils/api";
import { listTables, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function SeatReservation() {
  const {reservationId} = useParams();
  const history = useHistory();
  const [seatTable, setSeatTable] = useState(null);
  const [seatError, setSeatError] = useState(null);
  const [tables, setTables] = useState([]);

  const selectTable = tables.map((table) => (
    <option value={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  ));

  useEffect(loadTables, []);

  function loadTables(){
    const abortController = new AbortController();
    setSeatError(null);
    listTables(abortController.signal)
    .then(setTables)
    .catch(setSeatError);
    return () => abortController.abort();
  }

  async function seatReservation(reservationId, status){
    try {
   await updateReservation(reservationId, status)
    } catch(error) {
      setSeatError(error)
    }
 }

 const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updated = await updateTable(seatTable, reservationId);
      seatReservation(reservationId, "seated")
      if (updated){
        history.push("/");
      }
    } catch(error){
      setSeatError(error)
    }
  }

  const handleChange = ({target}) => {
    const value = target.value;
    setSeatTable(value);
  }
 
  return (
    <>
    <ErrorAlert error={seatError} />
    <form onSubmit={handleSubmit}>
      <label>
        Table Number
        <select id="table_id" name="table_id" onChange={handleChange} required>
          <option value={null}>Select a table</option>
          {selectTable}
        </select>
      </label>
      <button type="submit" onClick={handleSubmit}>Submit</button>
      <button onClick={() => history.go(-1)}>Cancel</button>
    </form>
    </>
  );
}
