import React from 'react';
import ReactWordcloud from 'react-wordcloud';
import Filters from './Filters/Filters'
import PreLoader from "./preloader";

class WordCloud extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
          data:[],
          words:[{
            text:null,
            value:null
          }],
          flag:0

      }

    }
    componentDidUpdate(prevProps) {
      if(prevProps.db!==this.props.db){
        this.setState({flag:0})
      }
      
    }
handleQuery = (data) => {
    
    this.setState({data:data})
    this.state.data = data
    this.query()


  }

 
      query = () =>{

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
          j=0
         
          if(this.state.data[i].spacy!==undefined){
            while(j<this.state.data[i].spacy.processed_text.length){
              temp=this.state.data[i].spacy.processed_text[j].split(" ")[0]
            
             if(this.checkWord(temp)===false&&this.state.data[i].spacy.processed_text[j].split(" ")[3]!=='CCONJ'
              ){
                k=0
              flag = false
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
              }
              
   
                
              j++
            }
          }

         i++
         
        }
        this.state.words=words
        this.setState({words:words})

        this.setState({flag:1})

      }
   
      checkWord = (temp) => {

        //check if string is a tag 
        if(temp[0]==='@'){
          return true
        }
    
        //check if string is a number
        if(!isNaN(+temp)){
          return true
        }
        
        //check if string is a url

        //controllo url rimosso per migliorare le
        /*
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  
        if(pattern.test(temp)){
          return true
        }
        */

        return false
        
      }
    
      render () {
        var body;
        if(this.state.flag>0){
          body =<div className="row">
          <div className="col-lg-12">
            <div className="chart" id="wordChart">
            <ReactWordcloud words={this.state.words}       options={{
        fontFamily: 'monospace',
        fontSizes: [20, 50],
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
            <h3>Word Cloud - {this.props.db} </h3>
            <br/>
            <Filters parentCallback = {this.handleQuery.bind(this)} db = {this.props.db}/>
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