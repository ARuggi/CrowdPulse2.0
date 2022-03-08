import React from "react";
import {Line} from 'react-chartjs-2';




const TimeLineChart = (props) =>{
    var i=0
    var labels=[]
    var dataValue=[]
    
    
    while(i<props.data.length){
        labels[i]=props.data[i].id
        dataValue[i]=props.data[i].counter
        i++
        
    }
    
    const data = {
        labels:  labels,
      datasets: [{
        label: 'Tweets',
        data: dataValue,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
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

export default TimeLineChart