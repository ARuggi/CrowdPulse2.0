import React from "react";
import {Line} from 'react-chartjs-2';


const data = {
    labels:  [
        'Eating',
        'Drinking',
        'Sleeping',
        'Designing',
        'Coding',
        'Cycling',
        'Running'
      ],
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40,90],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
  };

const LineChart = () =>{
    return(
        <div>
            <Line
	data= {data}
	width={100}
	height={400}
	options={{ maintainAspectRatio: false }}
            />
        </div>
    )
}

export default LineChart