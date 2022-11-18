import React, { useState } from "react";

import "./table.css";
import Table from ".";
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import XLSX from 'xlsx'

const exportData = [];
const columns = [
    {
        "title":"username",
        "field":"author_username"
    },
    {
        "title":"text",
        "field":"raw_text"
    },
    {
        "title":"tags",
        "field":"tags"
    }
]

function setData(props) {
    for (let i = 0; i < props.data.length ; i++) {
        exportData.push({
            author_username: props.data[i].author_username,
            raw_text: props.data[i].raw_text,
            tags: printTags(props.data[i])
        })
    }
}

function downloadExcel() {
    const newData = exportData.map(row => {
        delete row.tableData;
        return row;
    })
    const workSheet = XLSX.utils.json_to_sheet(newData)
    const workBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workBook, workSheet, "students")
    //Buffer
    XLSX.write(workBook, { bookType: "xlsx", type: "buffer" })
    //Binary string
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
    //Download
    XLSX.writeFile(workBook, "TweetData.xlsx")
}

function printTags(data) {

    if (data.tags === undefined) {
        return ("");
    }

    let tags = [];
    for (let i = 0; i < data.tags.tag_me.length; i++) {
        let temp = data.tags.tag_me[i].split(" : ");
        tags = tags + "," + temp[0];
    }

    return tags
}

function downloadPdf() {

    const doc = new jsPDF('landscape');
    console.log(exportData);

    doc.text("Tweet Details", 20, 10);
    doc.autoTable({
        theme: "grid",
        columns: columns.map(col => ({ ...col, dataKey: col.field })),
        body: exportData
    });

    doc.save('table.pdf');
}

function DisplayTable(props) {

    setData(props);
    return (
        <main className="container_table">
            <button className='button activeButton' onClick={() => {downloadPdf()}} > Export Table</button>
            <button className='button activeButton' onClick={() => {downloadExcel()}} > Export Excel</button>
            <br/><br/><br/>
            <div className="wrapper_table">
                <Table data={props.data} rowsPerPage={100} />
            </div>
        </main>
    );
}

export default DisplayTable;