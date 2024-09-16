import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  department: string;
  startDate: string;
}

const Table: React.FC = () => {
  const [rowData] = useState<Employee[]>([
    { id: 1, firstName: 'John', lastName: 'Doe', department: 'IT', startDate: '2020-01-15' },
    { id: 2, firstName: 'Jane', lastName: 'Dee', department: 'HR', startDate: '2021-05-10' },
    { id: 3, firstName: 'Bob', lastName: 'Smith', department: 'IT', startDate: '2019-08-22' },
    { id: 4, firstName: 'Alice', lastName: 'Johnson', department: 'Finance', startDate: '2022-03-05' },
    { id: 5, firstName: 'David', lastName: 'Lee', department: 'Marketing', startDate: '2018-06-12' },
    { id: 6, firstName: 'Emily', lastName: 'Chen', department: 'IT', startDate: '2021-11-28' },
    { id: 7, firstName: 'Michael', lastName: 'Kim', department: 'Finance', startDate: '2020-09-01' },
    { id: 8, firstName: 'Sophia', lastName: 'Brown', department: 'HR', startDate: '2019-04-18' },
  ]);

  const columnDefs = [
    { field: 'id' as const, headerName: 'ID', sortable: true, filter: true },
    { field: 'firstName' as const, headerName: 'First Name', sortable: true, filter: true },
    { field: 'lastName' as const, headerName: 'Last Name', sortable: true, filter: true },
    { field: 'department' as const, headerName: 'Department', sortable: true, filter: true },
    { field: 'startDate' as const, headerName: 'Start Date', sortable: true, filter: true },
  ];

  const defaultColDef = {
    resizable: true,
    sortable: true, // Global setting for sorting
    filter: true,   // Global setting for filtering
  };

  return (
    <div className="ag-theme-alpine" data-testid = "table-test" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef} 
      />
    </div>
  );
};

export default Table;