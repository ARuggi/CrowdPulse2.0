import axios from 'axios';
import SearchFilters from './SearchFilters';
import React from 'react';
import SearchText from './SearchText';
import SearchHashtag from './SearchHashtag';

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
            tags : [],
            text : [],
            hashtags : [],
            dataGroupByDates: [],
            fromDate: null,
            toDate : null,

        }
        
        this.getSentimentData(this.props.db)
    }

    componentDidUpdate(prevProps) {
      if(prevProps.db!==this.props.db){
        this.getSentimentData(this.props.db)
      }
      
    }

    getSentimentData = (db) => {

      //TODO selezione db
        axios.get('/tweet/getAnalyzedData', {
          params: {
            db: db
          }
        })
        .then((response) => {
          
          const data = response.data;
          var negative = 0
          var positive = 0
          var neutral = 0
          var i=0
          this.state.totalTweets = data.length
          while(i<data.length){
            if(data[i].sentiment!==undefined){
              if(data[i].sentiment['sent-it']!==undefined){
                if (data[i].sentiment['sent-it'].sentiment==='negative')
                  negative++
                else if (data[i].sentiment['sent-it'].sentiment==='positive')
                  positive ++
                else
                neutral ++
              }
            }
   
              i++
          }
          i=0
          while(i<data.length){
            if(data[i].sentiment!==undefined){
              if(data[i].sentiment['feel-it']!==undefined){
                if (data[i].sentiment['feel-it'].sentiment==='negative')
                  negative++
                else if (data[i].sentiment['feel-it'].sentiment==='positive')
                  positive ++
                else
                neutral ++
              }

            }

    
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

          

          var dataGroupByDates=[{
            id:null,
            counterPositive:null,
            counterNegative:null,
            counterNeutral:null,
          }]
    
          
          var j = 0
          
          if(this.state.data.length!==0){
            var i =this.state.data.length-1
            var dt = this.state.data[i].created_at.substring(0, 10)
            dataGroupByDates[0].id=dt
            i--
            while(i>-1){
              if(this.state.data[i].sentiment!==undefined){
                if(this.state.data[i].sentiment['feel-it']!==undefined){
              
              if(dataGroupByDates[j].id===this.state.data[i].created_at.substring(0, 10)){
                if( this.state.data[i].sentiment['feel-it'].sentiment==='positive'){
                  dataGroupByDates[j].counterPositive++
                }else if( this.state.data[i].sentiment['feel-it'].sentiment==='negative'){
                  dataGroupByDates[j].counterNegative++
                }else if( this.state.data[i].sentiment['feel-it'].sentiment==='neutral'){
                  dataGroupByDates[j].counterNeutral++
                }
    
    
              }else{
                j++
    
                dataGroupByDates.push({
                  id:this.state.data[i].created_at.substring(0, 10),
                  counterPositive:0,
                  counterNegative:0,
                  counterNeutral:0,
                })
                if( this.state.data[i].sentiment['feel-it'].sentiment==='positive'){
                  dataGroupByDates[j].counterPositive++
                }else if( this.state.data[i].sentiment['feel-it'].sentiment==='negative'){
                  dataGroupByDates[j].counterNegative++
                }else if( this.state.data[i].sentiment['feel-it'].sentiment==='neutral'){
                  dataGroupByDates[j].counterNeutral++
                }
              }
            }
          }
              i--
            }
            
          }
    
          this.setState({dataGroupByDates : dataGroupByDates})
          this.state.dataGroupByDates=dataGroupByDates     
                      
          this.sendData()
      })
      .catch((error) => {
          console.log('error: ', error)
      });
    
      }
    
      //DATES FILTERS
      
      handleFromDatesChanges = (event) => {
        if(event.target.value!==""){
          this.state.fromDate = event.target.value
          if(this.state.data.length===0){
            this.state.data= this.state.oldData
            this.filterDataByDates()
            this.resetFilter()
          }else{
            this.filterDataByDates()
          }
         
        }else{
          this.resetFilter()
        }
      }
    
      handleToDatesChanges = (event) => {
        if(event.target.value!==""){
          this.state.toDate = event.target.value
          if(this.state.data.length===0){
            this.state.data= this.state.oldData
            this.filterDataByDates()
            this.resetFilter()
          }else{
            this.filterDataByDates()
          }
        }else{
          this.resetFilter()
        }
    
      }
    
    
      filterDataByDates = () => {   
          var tempData = []
          var i=0
          var j=0
    
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

      //END DATES FILTERS
    
      // CATEGORY
      handleCategory = (event) => {
        this.state.flagType = event.target.value        
        this.handleQuery()
      }

      //END CATEGORY



      handleTags = (tags) => {
        if(tags.length>this.state.tags.length){
          this.state.tags = tags
          this.filterByTags(tags)
          this.handleQuery()
        }else{
          this.state.tags = tags
          this.resetFilter()

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
          if(this.state.data[i].tags!==undefined){
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
          }

          i++
        }

        this.state.data = tempData //set Data
        
        
        
      }


      
/// TEXT SECTION

handleText = (text) => {
  if(text.length>this.state.text.length){

    this.state.text=text 
    this.filterByText(text)
    this.handleQuery()
  }else{
   this.state.text=text 
   this.resetFilter()
  }
}

filterByText = (text) => {

  var i =0
  var j =0
  var k = 0
  var z = 0
  var temp
  var tempData = []
  var flag = false
  
  while(i<this.state.data.length){
    j=0
    if(this.state.data[i].spacy!==undefined){
      while(j<this.state.data[i].spacy.processed_text.length){
        temp=this.state.data[i].spacy.processed_text[j].split(" ")
        
        while(k<text.length){
          if(temp.some(a => a.includes(text[k].name))===true){
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
    }

    i++
  }

 
  this.state.data=tempData
  this.state.totalTweets=tempData.length

  
}

/// HASHTAGS SECTION

handleHashtags = (hashtags) => {
  if(hashtags.length>this.state.hashtags.length){
    this.state.hashtags=hashtags
    this.filterByHashtags(hashtags)
    this.handleQuery()
  }else{
    this.state.hashtags=hashtags
    this.resetFilter()
  }
}

filterByHashtags = (hashtags) => {
  var i =0
  var j =0
  var k = 0
  var z = 0
  var temp
  var tempData = []
  var flag = false

  while(i<this.state.data.length){
    j=0
    if(this.state.data[i].twitter_entities!==undefined){
    if(this.state.data[i].twitter_entities.hashtags!==undefined){
      while(j<this.state.data[i].twitter_entities.hashtags.length){
        temp=this.state.data[i].twitter_entities.hashtags[j]
       
        while(k<hashtags.length){
          if(temp===hashtags[k].name){
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
    }
  }

    i++
  }

         
  this.state.data=tempData
  this.state.totalTweets=tempData.length
  
}

  //QUERY SECTION  
handleQuery = () => {
  if(this.state.data.length===0){
    
    var tempCounter = {
      positive:0,
      negative:0,
      neutral:0
    }
    this.state.totalTweets=0
    this.state.counter = tempCounter //reset counter
    this.sendData()
    
  }else{
    this.state.totalTweets=this.state.data.length
    this.query()
  }
}

      query = () => {
       
        var negative = 0
        var positive = 0
        var neutral = 0
        var i=0
        var tempCounter 
        
        if (this.state.flagType===0 || this.state.flagType==='0') {               
          while(i<this.state.data.length){
            if(this.state.data[i].sentiment!==undefined){
              if(this.state.data[i].sentiment['sent-it']!==undefined){
            
            if (this.state.data[i].sentiment['sent-it'].sentiment==='negative')
              negative++
            else if (this.state.data[i].sentiment['sent-it'].sentiment==='positive')
              positive ++
            else
              neutral ++
              }
            }
            i++
          }
          i=0
          while(i<this.state.data.length){
            if(this.state.data[i].sentiment!==undefined){
              if(this.state.data[i].sentiment['feel-it']!==undefined){
            if (this.state.data[i].sentiment['feel-it'].sentiment==='negative')
              negative++
            else if (this.state.data[i].sentiment['feel-it'].sentiment==='positive')
              positive ++
            else
              neutral ++
              }}
            i++
          }
    
          tempCounter = {
            positive: positive,
            negative: negative,
            neutral: neutral,
         }

        }else if(this.state.flagType===1 || this.state.flagType==='1'){
        
          while(i<this.state.data.length){
              if(this.state.data[i].sentiment!==undefined){
                if(this.state.data[i].sentiment['sent-it']!==undefined){

            if (this.state.data[i].sentiment['sent-it'].sentiment==='negative')
              negative++
            else if (this.state.data[i].sentiment['sent-it'].sentiment==='positive')
              positive ++
            else
              neutral ++
            

              }
            }
            i++
          }
          tempCounter = {
            positive: positive,
            negative: negative,
            neutral: neutral,
         }
         
        }else{
          
          while(i<this.state.data.length){
            if(this.state.data[i].sentiment!==undefined){
              if(this.state.data[i].sentiment['feel-it']!==undefined){
            if (this.state.data[i].sentiment['feel-it'].sentiment==='negative')
              negative++
            else if (this.state.data[i].sentiment['feel-it'].sentiment==='positive')
              positive ++
            else
              neutral ++
              }
            }
            i++
          }
          tempCounter = {
            positive: positive,
            negative: negative,
            neutral: neutral,
         }
        }    
        
        this.state.counter = tempCounter

         

          

        var dataGroupByDates=[{
          id:null,
          counterPositive:null,
          counterNegative:null,
          counterNeutral:null,
        }]
  
        
        var j = 0
        
        if(this.state.data.length!==0){
          var i =this.state.data.length-1
          var dt = this.state.data[i].created_at.substring(0, 10)
          dataGroupByDates[0].id=dt
          i--
          while(i>-1){
            if(this.state.data[i].sentiment!==undefined){
              if(this.state.data[i].sentiment['feel-it']!==undefined){
            
            if(dataGroupByDates[j].id===this.state.data[i].created_at.substring(0, 10)){
              if( this.state.data[i].sentiment['feel-it'].sentiment==='positive'){
                dataGroupByDates[j].counterPositive++
              }else if( this.state.data[i].sentiment['feel-it'].sentiment==='negative'){
                dataGroupByDates[j].counterNegative++
              }else if( this.state.data[i].sentiment['feel-it'].sentiment==='neutral'){
                dataGroupByDates[j].counterNeutral++
              }
  
  
            }else{
              j++
  
              dataGroupByDates.push({
                id:this.state.data[i].created_at.substring(0, 10),
                counterPositive:0,
                counterNegative:0,
                counterNeutral:0,
              })
              if( this.state.data[i].sentiment['feel-it'].sentiment==='positive'){
                dataGroupByDates[j].counterPositive++
              }else if( this.state.data[i].sentiment['feel-it'].sentiment==='negative'){
                dataGroupByDates[j].counterNegative++
              }else if( this.state.data[i].sentiment['feel-it'].sentiment==='neutral'){
                dataGroupByDates[j].counterNeutral++
              }
            }
          }
        }
            i--
          }
          
        }
  
        this.setState({dataGroupByDates : dataGroupByDates})
        this.state.dataGroupByDates=dataGroupByDates     
                    
        this.sendData()
      }


      resetFilter = () => {

        this.state.data= this.state.oldData

        if(this.state.fromDate!==null || this.state.toDate!==null ){
          this.filterDataByDates()
        }
        
        if(this.state.tags.length!==0){
          this.filterByTags(this.state.tags)
        }

        if(this.state.hashtags.length!==0){
          this.filterByHashtags(this.state.hashtags)
        }

        if(this.state.text.length!==0){
          this.filterByText(this.state.text)
        }

        this.handleQuery()

      }

    
      sendData = () =>{
        this.props.parentCallback(this.state.dataGroupByDates,this.state.counter);
      }
      
      

    
    render(){
        return(            
          <>
            <div className="row stat-cards">
              <div className="col-md-4 col-xl-4">
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
              <div className="col-md-6 col-xl-6">
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
              <div className="col-md-2 col-xl-2">
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
            <br></br>
            <div className="row stat-cards">
            <div className="col-md-4 col-xl-4">
              <article className="stat-cards-item">
                <div className="row">
    
                  <div className="col-md-12 col-xl-12">
                    <div className="stat-cards-info">
                      <center><h4>Tags</h4><br />
                      <SearchFilters parentCallback = {this.handleTags.bind(this)} db = {this.props.db}/>
                        
                      </center>
                    </div>
                  </div>
    
    
                </div>
    
              </article>
            </div>
    
            <div className="col-md-4 col-xl-4">
              <article className="stat-cards-item">
                <div className="row">
    
                  <div className="col-md-12 col-xl-12">
                    <div className="stat-cards-info">
                      <center><h4>Processed Text</h4><br />
                      <SearchText parentCallback = {this.handleText.bind(this)} db = {this.props.db}/>
                        
                      </center>
                    </div>
                  </div>
    
    
                </div>
    
              </article>
            </div>
    
            <div className="col-md-4 col-xl-4">
              <article className="stat-cards-item">
                <div className="row">
    
                  <div className="col-md-12 col-xl-12">
                    <div className="stat-cards-info">
                      <center><h4>Hashtags</h4><br />
                      <SearchHashtag parentCallback = {this.handleHashtags.bind(this)} db = {this.props.db}/>
                        
                      </center>
                    </div>
                  </div>
    
    
                </div>
    
              </article>
            </div>
    
    
          </div>
          </>
      )
    }
}

export default Filters