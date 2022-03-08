import React from "react";
import {Pie} from 'react-chartjs-2';


const PieChart = (props) =>{
  var negative = props.negative
  var positive = props.positive
  var neutral = props.neutral
  var data2 = [negative, neutral, positive]

  
  let total = data2.reduce((accumulator, currentValue) => accumulator + currentValue);
    
  var labels = data2.map(value => (value / total * 100).toFixed(2) + '%');

  const  data = {
    labels: [
      'Negative = ' + labels[0],
      'Neutral = '  + labels[1],
      'Positive = ' + labels[2]
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
  }
  const option = {
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          var dataset = data.datasets[tooltipItem.datasetIndex];
          var meta = dataset._meta[Object.keys(dataset._meta)[0]];
          var total = meta.total;
          var currentValue = dataset.data[tooltipItem.index];
          var percentage = parseFloat((currentValue/total*100).toFixed(2));
          return currentValue + ' (' + percentage + '%)';
        },
        title: function(tooltipItem, data) {
          return data.labels[tooltipItem[0].index];
        }
      }
    }
  }

    return(
        <div>
            <Pie
	 data = {data}
	width={100}
	height={400}
            />
        </div>
    )
    
}

export default PieChart