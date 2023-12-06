import React, {useState, useEffect} from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import CreateReservation from "../reservations/CreateReservation";
import CreateTable from "../tables/CreateTable";
import SeatReservation from "../reservations/SeatReservation";
import { listTables } from "../utils/api";
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState([]);

  useEffect(loadTables);

  function loadTables(){
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
    .then(setTables)
    .catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
      <CreateReservation/>
      </Route>
      <Route exact={true} path="/tables/new">
      <CreateTable />
      </Route>
      <Route path={`/reservations/:reservationId/seat`}>
    <SeatReservation tables={tables}/>
    </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} tables={tables} tablesError={tablesError}/>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
