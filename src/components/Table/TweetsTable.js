import React, { useState } from "react";

import "./table.css";
import Table from ".";

const DisplayTable = (props) => {
  
  return (
    <main className="container_table">
      <div className="wrapper_table">
        <Table data={props.data} rowsPerPage={10} />
      </div>
    </main>
  );
};

export default DisplayTable;