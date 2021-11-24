import React, { useState } from "react";

import countriesData from "../data/countries";
import "./Table/table.css";
import Table from "./Table";

const DisplayTable = () => {
  const [countries] = useState([...countriesData]);
  return (
    <main className="container_table">
      <div className="wrapper_table">
        <Table data={countries} rowsPerPage={4} />
      </div>
    </main>
  );
};

export default DisplayTable;