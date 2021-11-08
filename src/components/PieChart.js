import React from "react";
import {Pie} from 'react-chartjs-2';


const PieChart = (props) =>{
  var negative = props.negative
  var positive = props.positive
  var neutral = props.neutral
    return(
        <div>
            <Pie
	 data = {{
    labels: [
      'Negative',
      'Neutral',
      'Positive'
    ],
    datasets: [{
      label: 'Sentiment',
      data: [negative, neutral, positive],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  }}
	width={100}
	height={400}
	options={{ maintainAspectRatio: false }}
            />
        </div>
    )
}

export default PieChart