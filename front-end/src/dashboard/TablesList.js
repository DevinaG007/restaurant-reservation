import React from "react";

export default function TablesList({ tables }) {
  const listOfTables = tables.map((table) => (
    <tr>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>{table.reservation_id ? "Occupied" : "Free"}</td>
    </tr>
  ));

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Table Name</th>
            <th>Capacity</th>
            <th>Status</th>
          </tr>
          {listOfTables}
        </thead>
      </table>
    </>
  );
}
