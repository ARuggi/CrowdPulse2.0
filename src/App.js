import './style.css';


import axios from 'axios';

import './script.js'

import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';
import RadarChart from './components/RadarChart';
import SearchBar from './components/SearchFilters';

import BookData from "./Data.json";

import React from 'react';


class App extends React.Component {

  

  state = {
    setCounter: [],
    data: [],
    fromDate: null,
    toDate : null,
  };

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

      var sentCounter = {
          positive: positive,
          negative: negative,
          neutral: neutral,
       }

      console.log('sent: ', sentCounter)
      this.setState({ setCounter: sentCounter })
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
    var sentCounter = {
        positive: positive,
        negative: negative,
        neutral: neutral,
     }

    console.log('sent: ', sentCounter)
    this.setState({ setCounter: sentCounter })
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


    var sentCounter = {
        positive: positive,
        negative: negative,
        neutral: neutral,
     }

    console.log('sent: ', sentCounter)
    this.setState({ setCounter: sentCounter })
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

      var sentCounter = {
          positive: positive,
          negative: negative,
          neutral: neutral,
       }

      console.log('sent: ', sentCounter)
      this.setState({ setCounter: sentCounter })
      //this.setState({data : data}) settare i nuovi dati

      }


  }

  prova = () => {
    alert(this.state.toDate<this.state.data[0].created_at)
  }



  render() {
    return (
      <div>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CrowdPulse</title>
        {/* Favicon */}
        {/* Custom styles */}
        <link rel="stylesheet" href="./css/style.css" />
        <div className="layer" />
        {/* ! Body */}
        <a className="skip-link sr-only" href="#skip-target">Skip to content</a>
        <div className="page-flex" style={{ backgroundImage: 'url(img/connection.png)' }}>
          {/* ! Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-start">
              <div className="sidebar-head">
                <button className="sidebar-toggle transparent-btn" title="Menu" type="button">
                  <span className="sr-only">Toggle menu</span>
                  <span className="icon menu-toggle" aria-hidden="true" />
                </button>
              </div>
              <div className="sidebar-body">
                <ul className="sidebar-body-menu">
                  <li>
                    <a className="active" href="/"><span className="icon home" aria-hidden="true" />Dashboard</a>
                  </li>
                  <li>
                    <a href="#export"><span className="icon edit" aria-hidden="true" />Export</a>
                  </li>
                  <li>
                    <a class="show-cat-btn" href="##">
                        <span class="icon document" aria-hidden="true"></span>Data Visualization
                        <span class="category__btn transparent-btn" title="Open list">
                            <span class="sr-only">Open list</span>
                            <span class="icon arrow-down" aria-hidden="true"></span>
                        </span>
                    </a>
                    <ul class="cat-sub-menu">
                        <li>
                            <a href="#">Sentiment</a>
                        </li>
                        <li>
                            <a href="##">Word</a>
                        </li>
                        <li>
                            <a href="##">Timelines</a>
                        </li>
                    </ul>
                </li>


                <li>
                    <a class="show-cat-btn" href="##">
                        <span class="icon folder" aria-hidden="true"></span>Database
                        <span class="category__btn transparent-btn" title="Open list">
                            <span class="sr-only">Open list</span>
                            <span class="icon arrow-down" aria-hidden="true"></span>
                        </span>
                    </a>
                    <ul class="cat-sub-menu">
                        <li>
                            <a href="#">Db1</a>
                        </li>
                        <li>
                            <a href="##">Db2</a>
                        </li>
                    </ul>
                </li>
                  
                </ul>
              </div>
            </div>
            <div className="sidebar-footer">
              <ul className="sidebar-body-menu">
                <li>
                  <button className="theme-switcher gray-circle-btn" type="button" title="Switch theme">
                    <span className="sr-only">Switch theme</span>
                    <i className="sun-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-brightness-high-fill" viewBox="0 0 16 16">
                      <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                    </svg></i>
                    <i className="moon-icon " aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-moon-fill" viewBox="0 0 16 16">
                      <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
                    </svg></i>
                  </button>
                </li>
              </ul>
            </div>
          </aside>
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
                              <select id="sel1" >
                                <option>All</option>
                                <option>Sent-it</option>
                                <option>Feel-it</option>

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
                            <SearchBar placeholder="Enter Tags" data={BookData} />
                              
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
                      <BarChart  negative={this.state.setCounter.negative}
                       neutral={this.state.setCounter.neutral}
                       positive={this.state.setCounter.positive}/>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="chart">
                      <PieChart
                      negative={this.state.setCounter.negative}
                      neutral={this.state.setCounter.neutral}
                      positive={this.state.setCounter.positive} />
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
        </div>
        {/* Chart library */}
        {/* Icons library */}
        {/* Custom scripts */}
        {/* partial */}

        </div>

    );
  }

}





export default App;
