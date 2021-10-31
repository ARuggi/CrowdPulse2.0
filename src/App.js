
import './App.css';

import axios from 'axios';

import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';
import RadarChart from './components/RadarChart';
import React from 'react';

class App extends React.Component{

  state = {
    tweet: []
  };

  getData = () => {
    axios.get('/tweet/search')
      .then((response) => {
        const data = response.data;
        this.setState({ tweet : data });
        alert("Dati ricevuti correttamente")        
      })
      .catch(error => {
        console.log(error.response.data.error)
        alert(error)
     });
  }
  render() {
  return (
    <div>
      <h1>Sentiment Charts</h1>
      <BarChart />
      <PieChart />
      <RadarChart/>
      <LineChart/>

      <button onClick={this.getData}>Prendi i tweet</button>
    </div>

  );
  }

}

  

export default App;
