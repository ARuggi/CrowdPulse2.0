import React, { useState } from "react";


import "./table.css";
import Table from ".";
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import XLSX from 'xlsx'

var exportData=[];
const columns = [
  { title: "username", field: "author_username", },
  { title: "text", field: "raw_text", },
  { title: "tags", field: "tags",  }]

const setData = (props) =>{
 
  var i = 0
  while (i<props.data.length) {
    exportData.push({
      author_username:props.data[i].author_username,
      raw_text:props.data[i].raw_text,
      tags:printTags(props.data[i])
    })
    i++
  }  
}

const downloadExcel = () => {
  const newData = exportData.map(row => {
    delete row.tableData
    return row
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




  const printTags = (data) =>{
    var i = 0
    var temp 
     var tags = []
    
     if(data.tags!==undefined){

     while(i<data.tags.tag_me.length){
        temp = data.tags.tag_me[i].split(" : ")
        tags = tags+","+temp[0]
        i++
    }
    return tags

     }else{
       return(
         ""
       )
     }
  
    
  }

const downloadPdf = () => {
  const doc = new jsPDF('landscape')

  console.log(exportData)
  doc.text("Tweet Details", 20, 10)
  doc.autoTable({
    theme: "grid",
    columns: columns.map(col => ({ ...col, dataKey: col.field })),
    body: exportData
  })
  doc.save('table.pdf')
}

const DisplayTable = (props) => {
  setData(props)
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
};

export default DisplayTable;