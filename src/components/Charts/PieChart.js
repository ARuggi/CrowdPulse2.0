import React from "react";
import {Pie} from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';




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
  plugins={[ChartDataLabels]}
	options={{ 
    tooltips: {
      enabled: false
      
  },
  plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map(data => {
              sum += data;
          });
          let percentage = (value*100 / sum).toFixed(2)+"%";
          return percentage;
      },
      color: '#fff',
      }
  }
      ,
    maintainAspectRatio: false }}
            />
        </div>
    )
}

export default PieChart