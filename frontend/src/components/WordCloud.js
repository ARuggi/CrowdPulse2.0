import React from 'react';
import ReactWordcloud from 'react-wordcloud';
import Filters from './Filters/WordChartFilters'
import PreLoader from "./preloader";
import stopWords from "../stopwords.json"
import _ from "lodash"; 

class WordCloud extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
          data:[],
          words:[{
            text:null,
            value:null
          }],
          flag:0,
          flagWord:0

      }

    }
    componentDidUpdate(prevProps) {
      if(prevProps.db!==this.props.db){
        this.setState({flag:0})
      }
      
    }
    
  handleQuery = (temp) =>{

    this.setState({data:temp.data})
    this.state.data = temp.data
    this.state.flagWord = temp.typeWord;
    
    if(this.state.flagWord===0||this.state.flagWord==='0'){
      this.queryText();
    }else if(this.state.flagWord===1||this.state.flagWord==='1'){
      this.queryTag();
    }else{
      this.queryHashtag();
    }
    this.state.flag=1;
    this.setState({flag:1});
    


  }

  queryTag = () =>{

    var i = 0
    var j = 0
    var k = 0
   
    var words=[{
        text:null,
        value:0
    }]

    var temp = null

    var arrayWords = []

    var flag = false

    
    
    while(i<this.state.data.length){
      j=0;
      if(this.state.data[i].tags!==undefined){
        
        while(j<this.state.data[i].tags.tag_me.length){
          
          temp=this.state.data[i].tags.tag_me[j].split(' : ')[0]
          k=0;
          flag=false;
          while(k<arrayWords.length){
            if(arrayWords[k]===temp){
              flag=true;
              break
            }
            k++
          }
    
          if(flag===true){
            words[k].value++
          }else{
            arrayWords.push(temp)
            words.push({
              text:temp,
              value:1
            })            
      

            
          }    
          j++;
      
        }
      }

    i++
    }
    
    
    this.state.words=words
    this.setState({words:words})
    
    this.setState({flag:1})
    

  }

  queryHashtag = () =>{

    var i = 0
    var j = 0
    var k = 0
   
    var words=[{
        text:null,
        value:0
    }]

    var temp = null;

    var arrayWords = [];

    var flag = false;

    

    
     
    while(i<this.state.data.length){
      j=0;

      if(this.state.data[i].twitter_entities.hashtags!==undefined){
        
        while(j<this.state.data[i].twitter_entities.hashtags.length){
          
          temp=this.state.data[i].twitter_entities.hashtags[j]
          k=0;
          flag=false;
          while(k<arrayWords.length){
            if(arrayWords[k]===temp){
              flag=true
              break
            }
            k++
          }
    
          if(flag===true){
            words[k].value++
          }else{
            arrayWords.push(temp)
            words.push({
              text:temp,
              value:1
            })            

            
          }    
          j++;
      
        }
      }
     
     i++
     
    }
    
    this.state.words=words
    this.setState({words:words})
    
    this.setState({flag:1})

  }


 
      queryText = () =>{

        var i = 0
        var j = 0
        var k = 0
       
        var words=[{
            text:null,
            value:0
        }]

        var temp = null

        var arrayWords = []

        
        var index = 1;

        

       
        while(i<this.state.data.length){
          j=0;
          //check spacy not null
          if(this.state.data[i].spacy!==undefined){
            while(j<this.state.data[i].spacy.processed_text.length){
              temp=this.state.data[i].spacy.processed_text[j].split(" ")[0];
              //check word
             if(this.checkWord(temp)===false&&this.state.data[i].spacy.processed_text[j].split(" ")[3]!=='CCONJ'
              ){
                
                //check if the word has already been counted  
                if(arrayWords[temp]===undefined){
                  words.push({
                    text:temp,
                    value:1
                  })
                  arrayWords[temp] = index;
                  index++;
                  
                }else{
                  try {
                    words[arrayWords[temp]].value++;
                  } catch (error) {
                    
                  }
                  
                }

  

                

              }               
               
              j++;
            }
          }

         i++
         
        }
        
        
        this.state.words=words;
        this.setState({words:words});
        
        this.setState({flag:1});

      }
   
      checkWord = (temp) => {
        
        //check if is a character
        if(temp.length===1){
          return true;
        }
        //check if string is a tag 
        if(temp[0]==='@'){
          return true
        }
    
        //check if string is a number
        if(!isNaN(temp)){         
          return true
        }

        //chek if word is a stopword
        var i =0;
        //'zr' is the last word of stopwords.json
        /*
        while(stopWords[i]!=='zr'){
          if(temp===stopWords[i]){
            return true;
          }
          i++;
        }
        */

        //Check if word startsm with https
        
        var pattern = new RegExp('^(https?|ftp)://');
          if(pattern.test(temp)){
          return true;
        }

        //Check if word is an emoji

        const regexExp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;

        if(regexExp.test(temp)){
          return true;
        }

        return false;
        
      }
    
      render () {
        const renderContent = () => {
          
           return <Filters parentCallback = {this.handleQuery.bind(this)} db = {this.props.db}  tweetsData={this.props.allTweetsData}/>;
         
          }
        
        var body;      
        var temp = renderContent();
        var filters;
        
        if(temp!==null){
          filters=temp;
        }else{
          filters=<PreLoader/>
        }
        if(this.state.flag>0){
          body =<div className="row">
          <div className="col-lg-12">
            <div className="CloudChart" id="wordChart">
            <ReactWordcloud words={this.state.words}       options={{
              fontFamily: 'monospace',
              rotations: 1,
              rotationAngles: [0],
              fontSizes: [20, 60],
            }} />
            </div>
          </div>

        </div>
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
            <h3>Word Cloud - {this.props.mongodb} </h3>
            <br/>
            {filters}
            
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
export default WordCloud