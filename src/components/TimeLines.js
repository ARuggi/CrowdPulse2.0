import axios from 'axios';

import SearchFilters from './Filters/SearchFilters';
import React from 'react';
import TimeLineChart from './Charts/TimeLineChart';


class TweetList extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
          totalTweets: 0,
          flagType: 0,
          counter : [],
          oldData : [],
          data: [],
          dataGroupByDates:[],
          fromDate: null,
          toDate : null,

      }
      
      this.getData(this.props.db)
    }
  
     
    getData = (db) => {

      //TODO selezione db
        axios.get('/tweet/getDataSortByDate')
        .then((response) => {
          const data = response.data;
          this.setState({data : data})
          this.setState({oldData : data})
          this.setState({totalTweets : data.length})
          this.query()

      })
      .catch((error) => {
          console.log('error: ', error)
      });
    
      }
      
      handleFromDatesChanges = (event) => {
        if(event.target.value!==""){
          this.state.fromDate = event.target.value
          this.filterDataByDates()
        }
      }
    
      handleToDatesChanges = (event) => {
        if(event.target.value!==""){
          this.state.toDate = event.target.value
          this.filterDataByDates()
        }
    
      }
    
    
      filterDataByDates = () => {
      
        var tempData = []
        var i=0
        var j=0
        this.setState({oldData: this.state.data}) //save last data state
  
        if(this.state.fromDate===null){
         //fromdate Null
  
  
         while(i<this.state.data.length){
          if (this.state.data[i].created_at<this.state.toDate){
            tempData[j]= this.state.data[i]
            j++
          }else if (this.state.data[i].created_at<this.state.toDate){
            tempData[j]= this.state.data[i]
            j++
          }else if (this.state.data[i].created_at<this.state.toDate ){
            tempData[j]= this.state.data[i]
            j++
          }            
  
          i++
      }

      this.state.data = tempData//set Data
  
        }else if(this.state.toDate===null){
          //todate Null                           
                                    
         while(i<this.state.data.length){
          if (this.state.data[i].created_at>this.state.fromDate){
              tempData[j]= this.state.data[i]
              j++
          }else if (this.state.data[i].created_at>this.state.fromDate){
              tempData[j]= this.state.data[i]
              j++
          }else if (this.state.data[i].created_at>this.state.fromDate ){
              tempData[j]= this.state.data[i]
              j++
          }
                 
          i++
      }
  
  
      this.state.data = tempData //save filtered datas
  
        }else if(this.state.fromDate!==null && this.state.fromDate!==null){
                 
          while(i<this.state.data.length){
            if (this.state.data[i].created_at>this.state.fromDate
            && this.state.data[i].created_at<this.state.toDate){
              tempData[j]= this.state.data[i]
              j++
            }else if (this.state.data[i].created_at>this.state.fromDate
            && this.state.data[i].created_at<this.state.toDate){
              tempData[j]= this.state.data[i]
              j++
            }else if (this.state.data[i].created_at>this.state.fromDate
                && this.state.data[i].created_at<this.state.toDate){
                  tempData[j]= this.state.data[i]
                  j++
                }
             
  
            i++
        }
  
       this.state.data = tempData //set Data
  
        }

        this.handleQuery()
  
  
    }

      handleTags = (tags) => {
        if(tags.length>0){
          
          this.filterByTags(tags)
        }else{
          
          this.state.data = this.state.oldData
          this.state.totalTweets=this.state.oldData.length
          this.query()
          
        }
      }

      handleQuery = () =>{
        if(this.state.data.length===0){
          
          this.state.totalTweets=0
          this.setState({data: this.state.oldData}) //save last data state
          this.query()
          
        }else{
          this.state.totalTweets=this.state.data.length
          this.query()
        }
      }
      
      filterByTags = (tags) => {
        
        var i =0
        var j =0
        var k = 0
        var z = 0
        var temp
        var tempData = []
        var flag = false
        
        while(i<this.state.data.length){
          j=0
          while(j<this.state.data[i].tags.tag_me.length){
            temp=this.state.data[i].tags.tag_me[j].split(" : ")
            
            while(k<tags.length){
              if(temp.some(a => a.includes(tags[k].name))===true){
                flag = true               
              }else{
                flag = false
              }
              k++
            }

            if(flag===true){
              tempData[z]= this.state.data[i]
              z++
            }
            k=0
            j++
          }
          i++
        }

       
        this.state.data=tempData
        this.state.totalTweets=tempData.length
        this.query()
        
      }

      query = () =>{
        var dataGroupByDates=[{
          id:null,
          counter:null
        }]

        var i = 0
        var j = 0
        
        if(this.state.data.length!==0){
          var dt = this.state.data[0].created_at.substring(0, 10)
          dataGroupByDates[0].id=dt

          while(i<this.state.data.length){

            if(dataGroupByDates[j].id===this.state.data[i].created_at.substring(0, 10)){
              dataGroupByDates[j].counter++
            }else{
              j++
              dataGroupByDates[j].id=this.state.data[i].created_at.substring(0, 10)
              dataGroupByDates[j].counter++
            }
            i++
          }
          
        }

        this.setState({dataGroupByDates : dataGroupByDates})
        this.state.dataGroupByDates=dataGroupByDates
        
      }
   
    
      render () {
          return(
        <div className="main-wrapper">
        {/* ! Main */}
        <main className="main users chart-page" id="skip-target">
          <div className="container">
            <h1>CrowdPulse</h1>
            <br/>
            <h3>Tweet List - {this.props.db} </h3>
            <br/>
            <div className="row stat-cards">
              <div className="col-md-4 col-xl-5">
                <article className="stat-cards-item">
                  <div className="row">

                    <div className="col-md-12 col-xl-12">
                      <div className="stat-cards-info">
                        <center><h4>Tags</h4><br />
                        <SearchFilters parentCallback = {this.handleTags.bind(this)}/>
                          
                        </center>
                      </div>
                    </div>


                  </div>

                </article>
              </div>
              <div className="col-md-4 col-xl-5">
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
              <div className="col-md-4 col-xl-2">
                <article className="stat-cards-item">
                  <div className="row">
                    <div className="col-md-12 col-xl-12">
                      <div className="stat-cards-info">
                        <center><h4>Total Tweets</h4><br />
                           <h1> {this.state.totalTweets} </h1>
                          
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
                  <TimeLineChart data={this.state.dataGroupByDates}/>
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