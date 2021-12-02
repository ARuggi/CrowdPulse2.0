import axios from 'axios';
import SearchFilters from './SearchFilters';
import React from 'react';

class Filters extends React.Component{
    constructor (props) {
        super(props)
        this.sendData=this.sendData.bind(this)

        this.state = {
            totalTweets: 0,
            flagType: 0,
            counter : [],
            oldData : [],
            data: [],
            fromDate: null,
            toDate : null,

        }
        
        this.getSentimentData(this.props.db)
    }

    getSentimentData = (db) => {

      //TODO selezione db
        axios.get('/tweet/getAnalyzedData')
        .then((response) => {
          const data = response.data;
          var negative = 0
          var positive = 0
          var neutral = 0
          var i=0
          this.state.totalTweets = data.length
          while(i<data.length){
              if (data[i].sentiment['sent-it'].sentiment==='negative')
                  negative++
              else if (data[i].sentiment['sent-it'].sentiment==='positive')
                  positive ++
              else
                  neutral ++
    
              i++
          }
          i=0
          while(i<data.length){
            if (data[i].sentiment['feel-it'].sentiment==='negative')
                negative++
            else if (data[i].sentiment['feel-it'].sentiment==='positive')
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
          this.setState({oldData : data})
          this.sendData()
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
    
      handleCategory = (event) => {
        this.state.flagType = event.target.value
        
        this.handleQuery()
      }

      handleQuery = () => {
        if(this.state.data.length===0){
          
          var tempCounter = {
            positive:0,
            negative:0,
            neutral:0
          }
          this.state.totalTweets=0
          this.state.counter = tempCounter //reset counter
          //this.setState({counter : tempCounter})//reset counters        
          this.setState({data: this.state.oldData}) //save last data state
          this.sendData()
          
        }else{
          this.state.totalTweets=this.state.data.length
          this.query()
        }
      }

      handleTags = (tags) => {
        if(tags.length>0){
          
          this.filterByTags(tags)
        }else{
          
          this.state.data= this.state.oldData
          this.handleQuery()
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

        //this.setState({oldData: this.state.data}) //save last data state
        
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

        this.state.data = tempData //set Data
        
        this.handleQuery()
        
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
        
        this.state.counter = tempCounter
        this.sendData()  
      }


      sendData = () =>{
        this.props.parentCallback(this.state.counter);
      }
      
      

    
    render(){
        return(            
            <div className="row stat-cards">
              <div className="col-md-3 col-xl-2">
                <article className="stat-cards-item">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="stat-cards-info">
                        <center><h4>Category</h4><br />
                          <select id="sel1" onChange={this.handleCategory} >
                            <option value="0">All</option>
                            <option value="1">Sent-it</option>
                            <option value="2">Feel-it</option>

                          </select>

                        </center>
                      </div>
                    </div>


                  </div>

                </article>
              </div>

              <div className="col-md-3 col-xl-4">
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
              <div className="col-md-3 col-xl-4">
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
              <div className="col-md-3 col-xl-2">
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
      )
    }
}

export default Filters