import React from "react";
import {Bar} from 'react-chartjs-2';

function EmotionBarChart(props) {

    const joy = props.feelCounter.joy;
    const sadness = props.feelCounter.sadness;
    const anger = props.feelCounter.anger;
    const fear = props.feelCounter.fear;

    return(
        <div>
            <Bar
                data= {{
                    labels: ['Joy','Sadness', 'Anger','Fear'],
                    datasets: [{
                        label: 'Emotion',
                        data: [joy, sadness, anger, fear],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(255, 206, 86, 1)',
                        ],
                        borderWidth: 1
                    }],
                }}
                width={100}
                height={400}
                options={{maintainAspectRatio: false}}
            />
        </div>
    );
}

export default EmotionBarChart;