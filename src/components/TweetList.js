import axios from 'axios';

import SearchFilters from '../components/SearchFilters';
import React from 'react';
import DisplayTable from './TweetsTable';

class TweetList extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            data: [],
            fromDate: null,
            toDate : null,
        }
    }

    getSentimentData = () => {
        axios.get('/tweet/getAnalyzedData')
        .then((response) => {
          const data = response.data;
          var i=0   
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
    

    
       
    
        //this.setState({data : data}) settare i nuovi dati
    
          }else if(this.state.toDate==null){
            //todate Null
                            

    
       

        //this.setState({data : data}) settare i nuovi dati
    
          }else if(this.state.fromDate!=null && this.state.fromDate!=null){

    
        
          
          //this.setState({data : data}) settare i nuovi dati
    
          }
    
    
      }
    
      query = () => {
       
        var negative = 0
        var positive = 0
        var neutral = 0
        var i=0
      
    
               
        
       
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
              <div className="col-lg-12">
                <div className="chart">
                  <DisplayTable/>
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
export default TweetList