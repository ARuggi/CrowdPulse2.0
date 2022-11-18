import React from "react";
import {Line} from 'react-chartjs-2';

function TimeLineChart(props) {

    const labels = [];
    const dataValue = [];

    for (const element of props.data) {
        labels.push(element.id);
        dataValue.push(element.counter);
    }

    const data = {
        labels: labels,
        datasets: [{
            label: 'Tweets',
            data: dataValue,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
        }],
    };

    return (
        <div>
            <Line
                data={data}
                width={100}
                height={400}
                options={{maintainAspectRatio: false}}
            />
        </div>
    );
}

export default TimeLineChart;