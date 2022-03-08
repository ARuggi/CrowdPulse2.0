import React from "react";
import {Bar} from 'react-chartjs-2';

const BarChart = (props) =>{
    var negative = props.negative
    var positive = props.positive
    var neutral = props.neutral
    return(
        <div>
          
            <Bar

data= {{
    labels: ['Negative','Neutral', 'Positive'],
    datasets: [{
        label: 'Sentiments',

        data: [negative, neutral, positive],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',           
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 206, 86, 0.2)'
            
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',            
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)'
            
        ],
        borderWidth: 1
    }]
 }}
	 
	width={100}
	height={400}
	options={{ maintainAspectRatio: false }}
            />
        </div>
    )

    
}



export default BarChart