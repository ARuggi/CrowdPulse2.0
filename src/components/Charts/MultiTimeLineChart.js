import React from "react";
import {Line} from 'react-chartjs-2';




const MultiLineChart = (props) =>{
    var i=0
    var labels=[]
    var dataValuePositive=[]
    var dataValueNegative=[]
    var dataValueNeutral=[]
    
    while(i<props.data.length){
        labels[i]=props.data[i].id
        dataValuePositive[i]=props.data[i].counterPositive
        dataValueNegative[i]=props.data[i].counterNegative
        dataValueNeutral[i]=props.data[i].counterNeutral
        i++
        
    }

    
    
    const data = {
        labels:  labels,
      datasets: [{
        label: 'Negative',
        data: dataValueNegative,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: 'Neutral',
        data: dataValueNeutral,
        fill: false,
        borderColor:  'rgb(54, 162, 235)',
        tension: 0.1
      },
      {
        label: 'Positive',
        data: dataValuePositive,
        fill: false,
        borderColor: 'rgb(255, 205, 86)',
        tension: 0.1
      }
         
    ]
     
      };

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

export default MultiLineChart