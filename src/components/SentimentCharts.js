
import BarChart from './Charts/BarChart';
import PieChart from './Charts/PieChart';
import MultiLineChart from './Charts/MultiTimeLineChart';
import Filters from './Filters/SentimentFilters';
import React from 'react';
import PreLoader from "./preloader";




class SentimentCharts extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      totalTweets: 0,
      flagType: 0,
      counter : [],
      dataGroupByDates:[],
      flag:0

      }

}

componentDidUpdate(prevProps) {
  if(prevProps.db!==this.props.db){
    this.setState({flag:0})
  }
  
}
    handleQuery = (dataGroupByDates,counter) => {
      
      this.setState({counter:counter})
      this.state.counter = counter

      this.setState({dataGroupByDates:dataGroupByDates})
      this.state.dataGroupByDates = dataGroupByDates
      this.setState({flag:1})
      
    }




    
      render () {
        var body;

        if(this.state.flag>0){

           body=  
          <>
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
              <MultiLineChart  data={this.state.dataGroupByDates}/>
                
              </div>
            </div>
          </div>
          </>
        }else{
          body=
          <div className="row">
            <div className="col-lg-12">
            <div className="chart"> <PreLoader/></div>
          </div>
          </div>
        }
          return(
            
        <div className="main-wrapper">

        {/* ! Main */}
        <main className="main users chart-page" id="skip-target">
          <div className="container">
            <h1>CrowdPulse</h1>
            <br/>
            <h3>Sentiment - {this.props.db} </h3>
            <br/>
            <Filters parentCallback = {this.handleQuery.bind(this)} db={this.props.db}/>
            <br/>
              {body}
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