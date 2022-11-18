import React from "react";
import {Radar} from 'react-chartjs-2';

function RadarChart(props) {

  const joy = props.feelCounter.joy;
  const sadness = props.feelCounter.sadness;
  const anger = props.feelCounter.anger;
  const fear = props.feelCounter.fear;

  return (
      <div>
        <Radar
            data= {{
              labels: [
                'Fear',
                'Joy',
                'Sadness',
                'Anger',
              ],
              datasets: [{
                label: 'Emotion',
                data: [fear,joy, sadness, anger],
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)'
              }]
            }}
            width={100}
            height={400}
            options={{maintainAspectRatio: false}}
        />
      </div>
  );
}

export default RadarChart;