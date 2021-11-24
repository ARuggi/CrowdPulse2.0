import axios from 'axios';
import BarChart from './Charts/BarChart';
import LineChart from './Charts/LineChart';
import PieChart from './Charts/PieChart';
import RadarChart from './Charts/RadarChart';
import SearchFilters from '../components/SearchFilters';
import React from 'react';


class SentimentCharts extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            flagType: 0,
            counter : [],
            data: [],
            fromDate: null,
            toDate : null,
        }
    }

    getSentimentData = () => {
        axios.get('/tweet/getAnalyzedData')
        .then((response) => {
          const data = response.data;
          var negative = 0
          var positive = 0
          var neutral = 0
          var i=0
          while(i<data.length){
              if (data[i].sentiment['sent-it'].sentiment=='negative')
                  negative++
              else if (data[i].sentiment['sent-it'].sentiment=='positive')
                  positive ++
              else
                  neutral ++
    
              i++
          }
          i=0
          while(i<data.length){
            if (data[i].sentiment['feel-it'].sentiment=='negative')
                negative++
            else if (data[i].sentiment['feel-it'].sentiment=='positive')
                positive ++
            else
                neutral ++
    
            i++
        }
    
          var tempCounter = {
              positive: positive,
              negative: negative,
              neutral: neutral,
           }
    
    
          this.setState({ counter: tempCounter })
          this.setState({data : data})
      })
      .catch((error) => {
          console.log('error: ', error)
      });
    
      }
    
      
      handleFromDatesChanges = (event) => {
        if(event.target.value!=""){
          this.state.fromDate = event.target.value
          this.filterDataByDates()
        }
      }
    
      handleToDatesChanges = (event) => {
        if(event.target.value!=""){
          this.state.toDate = event.target.value
          this.filterDataByDates()
        }
    
      }
    
    
      filterDataByDates = () => {
       
          var negative = 0
          var positive = 0
          var neutral = 0
          var i=0
    
          if(this.state.fromDate==null){
           //fromdate Null
    
    
           while(i<this.state.data.length){
            if (this.state.data[i].sentiment['sent-it'].sentiment=='negative'
            && this.state.data[i].created_at<this.state.toDate)
                negative++
            else if (this.state.data[i].sentiment['sent-it'].sentiment=='positive'
            && this.state.data[i].created_at<this.state.toDate)
                positive ++
            else if (this.state.data[i].sentiment['sent-it'].sentiment=='neutral'
                && this.state.data[i].created_at<this.state.toDate )
                neutral ++
    
            i++
        }
        var tempCounter = {
            positive: positive,
            negative: negative,
            neutral: neutral,
         }
    
        console.log('sent: ', tempCounter)
        this.setState({ counter: tempCounter })
        //this.setState({data : data}) settare i nuovi dati
    
          }else if(this.state.toDate==null){
            //todate Null
                            
            
                          
           while(i<this.state.data.length){
            if (this.state.data[i].sentiment['sent-it'].sentiment=='negative'
            && this.state.data[i].created_at>this.state.fromDate)
                negative++
            else if (this.state.data[i].sentiment['sent-it'].sentiment=='positive'
            && this.state.data[i].created_at>this.state.fromDate)
                positive ++
            else if (this.state.data[i].sentiment['sent-it'].sentiment=='neutral'
                && this.state.data[i].created_at>this.state.fromDate )
                neutral ++
    
            i++
        }
    
    
        var tempCounter = {
            positive: positive,
            negative: negative,
            neutral: neutral,
         }
    
        console.log('sent: ', tempCounter)
        this.setState({ counter: tempCounter })
        //this.setState({data : data}) settare i nuovi dati
    
          }else if(this.state.fromDate!=null && this.state.fromDate!=null){
                   
            while(i<this.state.data.length){
              if (this.state.data[i].sentiment['sent-it'].sentiment=='negative'
              && this.state.data[i].created_at>this.state.fromDate
              && this.state.data[i].created_at<this.state.toDate)
                  negative++
              else if (this.state.data[i].sentiment['sent-it'].sentiment=='positive'
              && this.state.data[i].created_at>this.state.fromDate
              && this.state.data[i].created_at<this.state.toDate)
                  positive ++
              else if (this.state.data[i].sentiment['sent-it'].sentiment=='neutral'
                  && this.state.data[i].created_at>this.state.fromDate
                  && this.state.data[i].created_at<this.state.toDate)
                  neutral ++
    
              i++
          }
    
          var tempCounter = {
              positive: positive,
              negative: negative,
              neutral: neutral,
           }
    
          console.log('sent: ', tempCounter)
          this.setState({ counter: tempCounter })
          //this.setState({data : data}) settare i nuovi dati
    
          }
    
    
      }
    
      handleCategory = (event) => {
        this.state.flagType = event.target.value
        this.query()
      }
    
      query = () => {
       
        var negative = 0
        var positive = 0
        var neutral = 0
        var i=0
        var tempCounter
    
        switch(this.state.flagType){
          case'0':
         
          while(i<this.state.data.length){
            if (this.state.data[i].sentiment['sent-it'].sentiment=='negative')
              negative++
            else if (this.state.data[i].sentiment['sent-it'].sentiment=='positive')
              positive ++
            else
              neutral ++
            i++
          }
          i=0
          while(i<this.state.data.length){
            if (this.state.data[i].sentiment['feel-it'].sentiment=='negative')
              negative++
            else if (this.state.data[i].sentiment['feel-it'].sentiment=='positive')
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
          break;
    
          case'1':
              
            while(i<this.state.data.length){
              if (this.state.data[i].sentiment['sent-it'].sentiment=='negative')
                negative++
              else if (this.state.data[i].sentiment['sent-it'].sentiment=='positive')
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
            break;
    
    
          case'2':
    
          while(i<this.state.data.length){
            if (this.state.data[i].sentiment['feel-it'].sentiment=='negative')
              negative++
            else if (this.state.data[i].sentiment['feel-it'].sentiment=='positive')
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
          break;
    
        }
        
        
        console.log('sent: ', tempCounter)
        this.setState({ counter: tempCounter })
        //this.setState({data : data})
      }
    
      prova = (event) => {
        
      }
    
      render () {
          return(
        <div className="main-wrapper">
        {/* ! Main */}
        <main className="main users chart-page" id="skip-target">
          <div className="container">
            <h1>CrowdPulse</h1>
            <br />
            <div className="row stat-cards">
              <div className="col-md-6 col-xl-4">
                <article className="stat-cards-item">
                  <div className="row">
                    <div className="col-md-3">
                      
                      <img src="https://img.icons8.com/external-justicon-lineal-justicon/64/000000/external-data-marketing-and-growth-justicon-lineal-justicon.png"/>
                      
                    </div>
                    <div className="col-md-9">
                      <div className="stat-cards-info">
                        <center><h4>Category</h4><br />
                          <select id="sel1" onChange={this.handleCategory} >
                            <option value="0">All</option>
                            <option value="1">Sent-it</option>
                            <option value="2">Feel-it</option>

                          </select>

                        </center>
                        <br/>
                         <button onClick={this.getSentimentData}>Grafici</button>

                         <br/>
                         <button onClick={this.prova}>Prova</button>
                      </div>
                    </div>


                  </div>

                </article>
              </div>

              <div className="col-md-6 col-xl-4">
                <article className="stat-cards-item">
                  <div className="row">
                    <div className="col-md-2 col-xl-2">
                    <img src="https://img.icons8.com/ios/100/000000/tags--v1.png"/>
                    </div>
                    <div className="col-md-10 col-xl-10">
                      <div className="stat-cards-info">
                        <center><h4>Tags</h4><br />
                        <SearchFilters/>
                          
                        </center>
                      </div>
                    </div>


                  </div>

                </article>
              </div>
              <div className="col-md-6 col-xl-4">
                <article className="stat-cards-item">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="stat-cards-info">
                        <center><h4>From </h4><br />
                          <input type="date" 
                          name="startDate"
                          onBlur={this.handleFromDatesChanges}/>
                        </center>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="stat-cards-info">
                        <center><h4>To </h4><br />
                          <input type="date"
                          id="toDate"
                          onBlur={this.handleToDatesChanges} />
                        </center>
                      </div>
                    </div>                     
                  </div>

                </article>
              </div>
            </div>
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