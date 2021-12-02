
import BarChart from './Charts/BarChart';
import LineChart from './Charts/LineChart';
import PieChart from './Charts/PieChart';
import RadarChart from './Charts/RadarChart';
import Filters from './Filters/SentimentFilters';
import React from 'react';




class SentimentCharts extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      data:[],
      counter:[],
      }

}
    handleQuery = (data) => {
      
      this.setState({data:data})
      this.state.data = data
      this.query()
    }

    query = () => {
       
        var negative = 0
        var positive = 0
        var neutral = 0
        var i=0
        var tempCounter 


        if (this.state.flagType===0) {
          
         
          while(i<this.state.data.length){
            
            if (this.state.data[i].sentiment['sent-it'].sentiment==='negative')
              negative++
            else if (this.state.data[i].sentiment['sent-it'].sentiment==='positive')
              positive ++
            else
              neutral ++
            i++
          }
          i=0
          while(i<this.state.data.length){
            if (this.state.data[i].sentiment['feel-it'].sentiment==='negative')
              negative++
            else if (this.state.data[i].sentiment['feel-it'].sentiment==='positive')
              positive ++
            else
              neutral ++
            i++
          }
    
          tempCounter = {
            positive: positive,
            negative: negative,
            neutral: neutral,
         }

        }else if(this.state.flagType===1){
          while(i<this.state.data.length){
            if (this.state.data[i].sentiment['sent-it'].sentiment==='negative')
              negative++
            else if (this.state.data[i].sentiment['sent-it'].sentiment==='positive')
              positive ++
            else
              neutral ++
            i++
          }
          tempCounter = {
            positive: positive,
            negative: negative,
            neutral: neutral,
         }
         
        }else{
          while(i<this.state.data.length){
            if (this.state.data[i].sentiment['feel-it'].sentiment==='negative')
              negative++
            else if (this.state.data[i].sentiment['feel-it'].sentiment==='positive')
              positive ++
            else
              neutral ++
            i++
          }
          tempCounter = {
            positive: positive,
            negative: negative,
            neutral: neutral,
         }
        }    
        
        this.setState({counter : tempCounter})
        //this.state.counter = tempCounter
        
      }

    
      prova = () => {
       alert("ciao")
      }

      
    
      render () {
          return(
        <div className="main-wrapper">
        {/* ! Main */}
        <main className="main users chart-page" id="skip-target">
          <div className="container">
            <h1>CrowdPulse</h1>
            <br/>
            <h3>Sentiment - {this.props.db} </h3>
            <br/>
            <Filters parentCallback = {this.handleQuery.bind(this)}/>
            <br/>
            <div className="row">
              <div className="col-lg-9">
                <div className="chart">
                  <BarChart  negative={this.state.counter.negative}
                   neutral={this.state.counter.neutral}
                   positive={this.state.counter.positive}/>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="chart">
                  <PieChart
                  negative={this.state.counter.negative}
                  neutral={this.state.counter.neutral}
                  positive={this.state.counter.positive} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="chart">
                <LineChart />
                  
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="chart">
                <RadarChart />
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* ! Footer */}
        <footer className="footer" style={{ background: 'blue' }}>
          <div className="container footer--flex">
            <div className="footer-start">
              <p>2021 © Giovanni Tempesta </p>
            </div>
          </div>
        </footer>
      </div>
      )
      }

}
export default SentimentCharts