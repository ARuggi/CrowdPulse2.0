import React, { useState } from "react";

import useTable from "../../hooks/useTable.js";
import "./table.css";
import TableFooter from "./TableFooter";


const printTags = (data) =>{
  var i = 0
  var temp 
   const tags = []
  
   if(data.tags!==undefined){
    while(i<data.tags.tag_me.length){
      temp = data.tags.tag_me[i].split(" : ")
      tags[i] = {
        name : temp[0],
        link : temp[3]
      }
      i++
  }

  return(
    tags.map(item=>(<a href={item.link} target="_blank" className="tag">{item.name}</a>))
   
    )
   }else{
     return(
       ""
     )
   }

  
}

const Table = ({ data, rowsPerPage }) => {
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(data, page, rowsPerPage);
  
  return (
    <>
      <table className="table" id="tabella">
        <thead className="tableRowHeader">
          <tr>
            <th className="tableHeader">Username</th>
            <th className="tableHeader">Text</th>
            <th className="tableHeader">Tags</th>
          </tr>
        </thead>
        <tbody>
          {slice.map((data) => (
            <tr className="tableRowItems" >
              <td className="tableCell">{data.author_username}</td>
              <td className="tableCell">{data.raw_text}</td>
              <td className="tableCell">{printTags(data)} </td>
            </tr>
          ))}
        </tbody>
      </table>

      <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
    </>
  );
};

export default Table;