import React, {useState, useEffect} from "react";
import { useHistory, useParams } from "react-router-dom";
import { updateTable } from "../utils/api";
import { readReservation } from "../utils/api";

export default function SeatReservation(tables) {
  const {reservationId} = useParams();
  const history = useHistory();
  const [seatTable, setSeatTable] = useState(null);
  const [reservation, setReservation] = useState({});
  const [seatError, setSeatError] = useState(null);
  const selectTable = tables.map((table) => (
    <option value={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  ));

  useEffect(() => loadReservation, [])

  function loadReservation(){  //may not need this API call, can validate reservation capacity in backend???
    const abortController = new AbortController();
    readReservation(reservationId, abortController.signal)
    .then(setReservation)
    .catch(setSeatError)
    return () => abortController.abort()
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    updateTable(seatTable, reservationId)
    .then(history.push("/"))
  }

  const handleChange = ({target}) => {
    const value = target.value;
    setSeatTable(value);
  }
 
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Table Number
        <select id="table_id" name="table_id" onChange={handleChange} required>
          {selectTable}
        </select>
      </label>
      <button type="submit">Submit</button>
      <button onClick={() => history.go(-1)}>Cancel</button>
    </form>
  );
}
