import React, {useState} from "react";
import TableForm from "./TableForm";
import { createTable } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

export default function CreateTable(){
    const history = useHistory();
    const initialFormState = {
        "table_name": "",
        "capacity": ""
    }
    const [table, setTable] = useState(initialFormState);
    const [tableError, setTableError] = useState(null);

    const handleChange = ({target}) => {
        const value = target.value;
        setTable({
            ...table,
            [target.name]:value
        })
    }

    const handleSubmit = async (event) => {
        const abortController = new AbortController();
        table.capacity = Number(table.capacity);
        event.preventDefault();
        try {
           let created = await createTable(table, abortController.signal);
           if (created){
            history.push("/")
           }
        } catch(error){
            setTableError(error)
        }
        return () => abortController.abort();
    }
    
    return (
        <>
        <h3>New Table</h3>
        <ErrorAlert error={tableError}/>
        <TableForm handleChange={handleChange} handleSubmit={handleSubmit} table={table}/>
        </>
    )
}