import React, {useState} from "react";
import TableForm from "./TableForm";
import { createTable } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

export default function CreateTable(){
    const history = useHistory();
    const initialFormState = {
        "table_name": "",
        "capacity": 1
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
    console.log(table.table_name)
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
           let created = await createTable(table);
           if (created){
            history.push("/")
            history.go(0)
           }
        } catch(error){
            setTableError(error)
        }
    }
    return (
        <>
        <h3>New Table</h3>
        <ErrorAlert error={tableError}/>
        <TableForm handleChange={handleChange} handleSubmit={handleSubmit} table={table}/>
        </>
    )
}