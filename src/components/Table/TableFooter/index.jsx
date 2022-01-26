import React, { useEffect } from "react";

import "./footer.css";

const TableFooter = ({ range, setPage, page, slice }) => {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);


  return (
    <div className='tableFooter'>     
    
    <button className={`button ${
            page -1 === 0 ? 'noClickButton' : 'activeButton'
          }`} onClick={() => setPage(page-1)}> Previous </button>
              Page {page} of {range.length}
        <button className={`button ${
            page +1 === range.length+1 ? 'noClickButton' : 'activeButton'
          }`} onClick={() => setPage(page+1)}> Next </button>

     {/* ! Paginator 
      {range.map((el, index) => (
        <button
          key={index}
          className={`button ${
            page === el ? 'activeButton' : 'inactiveButton'
          }`}
          onClick={() => setPage(el)}
        >
          {el}
        </button>
      ))}
      */}
    </div>
  );
};

export default TableFooter;