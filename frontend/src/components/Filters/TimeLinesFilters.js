import SearchUser from './SearchUser';
import SearchFilters from './SearchFilters';
import SearchText from './SearchText';
import SearchHashtag from './SearchHashtag';
import React from 'react';


class Filters extends React.Component{

    constructor (props) {
        super(props)
        this.query=this.query.bind(this)

        this.state = {
          totalTweets: 0,
          flagType: 0,
          flagSentiment : 0,
          counter : [],
          oldData : [],
          data: [],
          tags : [],
          text : [],
          users : [],
          hashtags : [],
          fromDate: null,
          toDate : null,

      }
     
      this.getData(this.props.tweetsData.dataSortByDate.data)
    }

    componentDidUpdate(prevProps) {
      if(prevProps.mongodb!==this.props.mongodb){
        this.getData(this.props.tweetsData.dataSortByDate.data)
      }
      
    }
   
    getData = (allData) => {

            const data = allData
            this.state.data = allData;
            this.state.oldData = allData;
            this.state.totalTweets = this.props.tweetsData.dataSortByDate.data.length;
            this.query()
              
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

        this.state.data=tempData
        this.state.totalTweets=tempData.length
    
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
    
    
        this.state.data=tempData
        this.state.totalTweets=tempData.length
    
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
    
          this.state.data=tempData
          this.state.totalTweets=tempData.length
          }

          this.handleQuery()
        
    
    
      }
         //END DATES FILTERS

      //TAGS SECTION
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

       
        this.state.data=tempData
        this.state.totalTweets=tempData.length
        this.handleQuery()
        
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
        this.handleQuery()
        
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

          i++
        }

               
        this.state.data=tempData
        this.state.totalTweets=tempData.length
        this.handleQuery()
      }

      ///USERS Section

handleUsers = (users) => {
  if(users.length>this.state.users.length){
    this.state.users=users
    this.filterByUser(users)
    this.handleQuery()
  }else{
    this.state.users=users
    this.resetFilter()
  }
}

filterByUser = (users) => {
  var i =0
  var j =0
  var k = 0

  var tempData = []
  var flag = false
  
  while(i<this.state.data.length){
    j=0   
      while(j<users.length){
        if(this.state.data[i].author_name===users[j].name){
         
          flag = true
          break;               
        }else{
          flag = false
        }
        j++;
      }
      if(flag===true){
        tempData[k]= this.state.data[i];
        k++
      }
    i++;
  }

         
  this.state.data=tempData
  this.state.totalTweets=tempData.length
  
}

            //RESET SECTIOn
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
      
              
        if(this.state.users.length!==0){
          this.filterByUser(this.state.users)
        }
              this.handleQuery()
      
            }
   


            handleQuery = () =>{
              if(this.state.data.length===0){
                
                this.state.totalTweets=0
                this.query()
                
              }else{
                this.state.totalTweets=this.state.data.length
                this.query()
              }
            }

      query = () =>{
        this.props.parentCallback(this.state.data);
      }
      

      
            // CATEGORY
            handleCategory = (event) => {

              if(this.state.flagType!==0 && this.state.flagSentiment!==0){
                this.state.flagType = event.target.value ;  
                this.state.data = this.state.oldData;
                console.log(this.state.data)
                this.resetFilter();
                this.filterByCategory();
              }else if(event.target.value===0 && this.state.flagSentiment===0){
                
                this.state.flagType = event.target.value ; 
                this.state.data = this.state.oldData;
                this.resetFilter();
                
              }else{
                this.state.flagType = event.target.value ;  
                this.filterByCategory();     
              }
      
              
            }
      
            handleSentiment = (event) => {
              if(this.state.flagType!==0 && this.state.flagSentiment!==0){
                this.state.flagSentiment = event.target.value ; 
                this.state.data = this.state.oldData;
                this.resetFilter();
                this.filterByCategory();
              }else if(this.state.flagType==0 && event.target.value==0){
               
                this.state.flagSentiment = event.target.value ; 
                this.state.data = this.state.oldData;
                this.resetFilter();
               
              }else{
                this.state.flagSentiment = event.target.value ;  
                this.filterByCategory();     
              } 
            }

        
      filterByCategory = () => {

        var i=0;
        var k = 0;
        var temp = []
        var flagAll = 0;
        
        if (this.state.flagType===0 || this.state.flagType==='0') { 
          
          if(this.state.flagSentiment===1 || this.state.flagSentiment==='1'){

            while(i<this.state.data.length){
              if(this.state.data[i].sentiment!==undefined){
                if(this.state.data[i].sentiment['sent-it']!==undefined){
                  if(this.state.data[i].sentiment['sent-it'].sentiment==='positive'){
                    temp[k]=this.state.data[i];
                    k++;
                    flagAll = 1;
                  }
                }
                
                if(this.state.data[i].sentiment['feel-it']!==undefined && flagAll===0){
                  if(this.state.data[i].sentiment['feel-it'].sentiment==='positive'){
                    temp[k]=this.state.data[i];
                    k++;
                  }
                                   
                }
              }
              flagAll=0;
              i++;
            }

          

            

          }else if(this.state.flagSentiment===2 || this.state.flagSentiment==='2'){

            while(i<this.state.data.length){
              if(this.state.data[i].sentiment!==undefined){
                if(this.state.data[i].sentiment['sent-it']!==undefined){
                  if(this.state.data[i].sentiment['sent-it'].sentiment==='neutral'){
                    flagAll = 1;
                    temp[k]=this.state.data[i];
                    k++;   
                  }
 
                }
                if(this.state.data[i].sentiment['feel-it']!==undefined  && flagAll===0){
                  if(this.state.data[i].sentiment['feel-it'].sentiment==='neutral'){
                    temp[k]=this.state.data[i];
                    k++;
                  }
                                   
                }
              }
              flagAll=0;
              i++;
            }

          }else if(this.state.flagSentiment===3 || this.state.flagSentiment==='3'){

            while(i<this.state.data.length){
              if(this.state.data[i].sentiment!==undefined){
                if(this.state.data[i].sentiment['sent-it']!==undefined){
                  if(this.state.data[i].sentiment['sent-it'].sentiment==='negative'){
                    flagAll = 1;
                    temp[k]=this.state.data[i];
                    k++;   
                  }
                  
                     
                }
                if(this.state.data[i].sentiment['feel-it']!==undefined  && flagAll===0){
                 
                  if(this.state.data[i].sentiment['feel-it'].sentiment==='negative'){
                    temp[k]=this.state.data[i];
                    k++;
                  }
                                   
                }
              }
              i++;
              flagAll=0;
            }

          }

          


          //Category Sent-it


        } 
        
        else if(this.state.flagType===1 || this.state.flagType==='1'){

          if (this.state.flagSentiment===0 || this.state.flagSentiment==='0'){
            while(i<this.state.data.length){
              if(this.state.data[i].sentiment!==undefined){
                if(this.state.data[i].sentiment['sent-it']!==undefined){
                  temp[k]=this.state.data[i];
                  k++;   
                }
             }
            i++;
          }
          }else if(this.state.flagSentiment===1 || this.state.flagSentiment==='1'){

            

            while(i<this.state.data.length){
              
              if(this.state.data[i].sentiment!==undefined){
                
                if(this.state.data[i].sentiment['sent-it']!==undefined){
                  
                  if(this.state.data[i].sentiment['sent-it'].sentiment==='positive'){
                    temp[k]=this.state.data[i];
                    k++;   
                  }
                         
                }
              }
              i++;
            }

           

          }else if(this.state.flagSentiment===2 || this.state.flagSentiment==='2'){

            while(i<this.state.data.length){
              if(this.state.data[i].sentiment!==undefined){
                if(this.state.data[i].sentiment['sent-it']!==undefined){
                  if(this.state.data[i].sentiment['sent-it'].sentiment==='neutral'){
                    temp[k]=this.state.data[i];
                    k++;   
                  }         
                }
              }
              i++;
            }

          }else if(this.state.flagSentiment===3 || this.state.flagSentiment==='3'){

            while(i<this.state.data.length){
              if(this.state.data[i].sentiment!==undefined){
                if(this.state.data[i].sentiment['sent-it']!==undefined){
                  if(this.state.data[i].sentiment['sent-it'].sentiment==='negative')
                  {
                    temp[k]=this.state.data[i];
                    k++;   
                  }          
                }
              }
              i++;
            }

          }
          



          //Category Feel-it
         
        }else{

          if (this.state.flagSentiment===0 || this.state.flagSentiment==='0'){
            while(i<this.state.data.length){
              if(this.state.data[i].sentiment!==undefined){
                if(this.state.data[i].sentiment['feel-it']!==undefined){
                  temp[k]=this.state.data[i];
                  k++;   
                }
             }
            i++;
          }
          }else if(this.state.flagSentiment===1 || this.state.flagSentiment==='1'){

            while(i<this.state.data.length){
              if(this.state.data[i].sentiment!==undefined){
                if(this.state.data[i].sentiment['feel-it']!==undefined){
                  if(this.state.data[i].sentiment['feel-it'].sentiment==='positive')
                  {
                    temp[k]=this.state.data[i];
                    k++;   
                  }          
                }
              }
              i++;
            }

          }else if(this.state.flagSentiment===2 || this.state.flagSentiment==='2'){

            while(i<this.state.data.length){
              if(this.state.data[i].sentiment!==undefined){
                if(this.state.data[i].sentiment['feel-it']!==undefined){
                  if(this.state.data[i].sentiment['feel-it'].sentiment==='neutral')
                  {
                    temp[k]=this.state.data[i];
                    k++;   
                  }          
                }
              }
              i++;
            }

          }else if(this.state.flagSentiment===3 || this.state.flagSentiment==='3'){

            while(i<this.state.data.length){
              if(this.state.data[i].sentiment!==undefined){
                if(this.state.data[i].sentiment['feel-it']!==undefined){
                  if(this.state.data[i].sentiment['feel-it'].sentiment==='negative')
                  {
                    temp[k]=this.state.data[i];
                    k++;   
                  }          
                }
              }
              i++;
            }

          }

         

      }
      
      this.state.data = temp
      this.handleQuery();

    }
              
      

    
    render(){
        return(      
          <>      
        <div className="row stat-cards">

        <div className="col-md-4 col-xl-4">
                <article className="stat-cards-item">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="stat-cards-info">
                        <center><h4>Algorithm</h4><br />
                          <select id="sel1" onChange={this.handleCategory} >
                            <option value="0">All</option>
                            <option value="1">Sent-it</option>
                            <option value="2">Feel-it</option>

                          </select>

                        </center>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="stat-cards-info">
                        <center><h4>Sentiment</h4><br />
                          <select id="sel1" onChange={this.handleSentiment} >
                            <option value="0">All</option>
                            <option value="1">Positive</option>
                            <option value="2">Neutral</option>
                            <option value="3">Negative</option>
                          </select>

                        </center>
                      </div>
                    </div>


                  </div>

                </article>
                </div>

        <div className="col-md-4 col-xl-4">
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
        <div className="col-md-4 col-xl-4">
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
        <div className="col-md-3 col-xl-3">
          <article className="stat-cards-item">
            <div className="row">

              <div className="col-md-12 col-xl-12">
                <div className="stat-cards-info">
                  <center><h4>Tags</h4><br />
                  <SearchFilters parentCallback = {this.handleTags.bind(this)} db = {this.props.db} allTags = {this.props.tweetsData.dataTags}/>
                    
                  </center>
                </div>
              </div>


            </div>

          </article>
        </div>

        <div className="col-md-3 col-xl-3">
          <article className="stat-cards-item">
            <div className="row">

              <div className="col-md-12 col-xl-12">
                <div className="stat-cards-info">
                  <center><h4>Processed Text</h4><br />
                  <SearchText parentCallback = {this.handleText.bind(this)} db = {this.props.db}  allText = {this.props.tweetsData.dataText}/>
                    
                  </center>
                </div>
              </div>


            </div>

          </article>
        </div>

        <div className="col-md-3 col-xl-3">
          <article className="stat-cards-item">
            <div className="row">

              <div className="col-md-12 col-xl-12">
                <div className="stat-cards-info">
                  <center><h4>Hashtags</h4><br />
                  <SearchHashtag parentCallback = {this.handleHashtags.bind(this)} db = {this.props.db} allHashtags = {this.props.tweetsData.dataHashtags}/>
                    
                  </center>
                </div>
              </div>


            </div>

          </article>
        </div>

        <div className="col-md-3 col-xl-3">
              <article className="stat-cards-item">
                <div className="row">
    
                  <div className="col-md-12 col-xl-12">
                    <div className="stat-cards-info">
                      <center><h4>Username</h4><br />
                      <SearchUser parentCallback = {this.handleUsers.bind(this)} db = {this.props.db} allUser = {this.props.tweetsData.users}/>
                        
                      </center>
                    </div>
                  </div>
    
    
                </div>
    
              </article>
            </div>


      </div>
      </>)
    }
}

export default Filters