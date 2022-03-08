import './style.css';
import './script.js';
import './App.css';
import axios from 'axios';
import SentimentCharts from './components/SentimentCharts';
import TweetList from './components/TweetList';
import WordChart from './components/WordCloud';
import TimeLines from './components/TimeLines';
import Maps from './components/Maps';
import Home from './components/Home';
//import Collection from './components/Collection';
import Dbs from './components/Dbs';
import LoadingData from './components/LoadingData';
import { jsPDF } from "jspdf";
import  html2canvas  from 'html2canvas';
import React from 'react';
import PreLoader from './components/preloader';


class App extends React.Component {

  state = {
    content:0,
    db_selected:"",
    mongodb_selected:"",
    collections:[],
    dbs:[],
    allTweetsData:[],  };
  constructor(props){
    super(props)
    this.getData()
 
    
  }

  getData = () => {
   
    //TODO selezione db


    axios.get('/tweet/dbs', {
        
    })
    .then((response) => {
      var i =0;
      var dbs = [];
      
      while(i<response.data.databases.length){
        if(response.data.databases[i].name!=='admin'&&response.data.databases[i].name!=='config'
        &&response.data.databases[i].name!=='test'&&response.data.databases[i].name!=='local'){
            dbs.push(response.data.databases[i].name);
        }
        
        i++;
      }
      this.setState({dbs:dbs})

  })
  .catch((error) => {
    
      console.log('error: ', error)
  });
       
    }

  getAllData = (data) => {
    this.state.allTweetsData = data;
    
  }


  loadSpinner = () => {
    this.setState({content:7});
  }  


  displaySentimentCharts = () => {
    if(this.state.mongodb_selected!==''){
      this.loadSpinner();
      setTimeout(function() { //Start the timer
        this.setState({content:1}); //After 1 second, set content to the correct section
    }.bind(this), 1000)
        
      
    }else{
      alert('Prima devi selezionare un Database');
    }
    
  }
 
  displayWordCloud = () => {
    if(this.state.mongodb_selected!==''){
      this.loadSpinner();
      setTimeout(function() { //Start the timer
        this.setState({content:2}); //After 1 second, set content to the correct section
    }.bind(this), 1000)
        
    }else{
      alert('Prima devi selezionare un Database');
      
    }
    
  }
 
  displayTimeLines = () => {
    if(this.state.mongodb_selected!==''){
      this.loadSpinner();
      setTimeout(function() { //Start the timer
        this.setState({content:3}); //After 1 second, set content to the correct section
    }.bind(this), 1000)
        
    }else{
      alert('Prima devi selezionare un Database');
      
    }
  }
 
  displayTweetList = () => {
    if(this.state.mongodb_selected!==''){
      this.loadSpinner();
      setTimeout(function() { //Start the timer
        this.setState({content:4}); //After 1 second, set content to the correct section
    }.bind(this), 1000)
        
    }else{
      alert('Prima devi selezionare un Database');      
    }
  }

  displayMaps = () => {
    if(this.state.mongodb_selected!==''){
      this.loadSpinner();
      setTimeout(function() { //Start the timer
        this.setState({content:5}); //After 1 second, set content to the correct section
    }.bind(this), 1000)
        
    }else{
      alert('Prima devi selezionare un Database');

    }
  }
  
  handleDbChange = (db) => {
    this.setState({db_selected:db});
    this.setState({content:6}); //set loading screen    
  }
  

  handleMongoDbChange = (mongodb) => {
   
    this.setState({mongodb_selected:mongodb});
    axios.get('/tweet/setDbs', {
      params: {
        mongodb: mongodb
      }        
    }).then((response) => {
      
    }).catch((error) => {    
      console.log('error: ', error)
  });
    this.getCollection();
    
  }

  getCollection = () => {
    axios.get('/tweet/collections', {
        
    })
    .then((response) => {
      var i =0;
      var collections = [];
      while(i<response.data.length){
        
          collections.push(response.data[i].name);
               
        i++;
      }
      this.state.collections = collections;
      
      this.setState({db_selected:null});
      this.setState({db_selected:'Message'});
      this.setState({collections:collections});
      this.setState({content:6}); //set loading screen

  })
  .catch((error) => {
    
      console.log('error: ', error)
  });

  }



  export = () => {
    var doc;
    var canvas;
    var canvasImage,canvasImage2,canvasImage3;
    switch(this.state.content){
      case(1): 
        doc = new jsPDF();
        canvas = document.getElementsByTagName('canvas');
        canvasImage = canvas[0].toDataURL('image/png',1.0);
        canvasImage2 = canvas[1].toDataURL('image/png',1.0);
        canvasImage3 = canvas[2].toDataURL('image/png',1.0);
  
        doc.addImage(canvasImage,'PNG',5,15,200,85,'alias1');
        doc.addImage(canvasImage2,'PNG',70,110,70,70,'alias2');
        doc.addImage(canvasImage3,'PNG',5,200,200,85,'alias3');  
        doc.save("reportSentiments.pdf");
        break
      case(2): 
        doc = new jsPDF('landscape') 
        var input = document.getElementById('wordChart');
        html2canvas(input).then((canvas) => {
          const imgData = canvas.toDataURL('image/jpg');
          doc.addImage(imgData, 'JPG', -20,20,350,150,'alias1');
          doc.save("wordChart.pdf");
        });

        break;
      case(3):
        doc = new jsPDF('landscape') 
        canvas = document.getElementsByTagName('canvas');
        canvasImage = canvas[0].toDataURL('image/png',1.0);
        doc.addImage(canvasImage,'PNG',0,50,290,100,'alias1');
        doc.save("timeLines.pdf");
        break;
      case(4):
        
        const tabella = document.getElementById('tabella');
        const pdf = new jsPDF('landscape');
        pdf.html(tabella,{ html2canvas: { scale: 0.2 } }).then(() => {
          pdf.save("tabella.pdf");
        }).catch((error) => {
      
          console.log('error: ', error)
      });
      case(5): 
      //bug
      const mappa = document.getElementById('mapCanvas');
      const pdfMappa = new jsPDF('landscape');
      pdfMappa.html(mappa,{ html2canvas: { scale: 0.2 } }).then(() => {
        pdfMappa.save("mappa.pdf");
      }).catch((error) => {
    
        console.log('error: ', error)
    });
    }

  }




  render() {

    const renderContent = () => {
      
      
      switch(this.state.content){
        case(0):
        return <Home db={this.state.db_selected} mongodb={this.state.mongodb_selected} />;
        case(1): 
          return <SentimentCharts db={this.state.db_selected} mongodb={this.state.mongodb_selected} allTweetsData={this.state.allTweetsData}/>;
        case(2): 
          return <WordChart db={this.state.db_selected} mongodb={this.state.mongodb_selected} allTweetsData={this.state.allTweetsData}/>;
        case(3): 
          return <TimeLines db={this.state.db_selected} mongodb={this.state.mongodb_selected} allTweetsData={this.state.allTweetsData}/>;
        case(4):
          return <TweetList db={this.state.db_selected} mongodb={this.state.mongodb_selected} allTweetsData={this.state.allTweetsData}/>;
        case(5): 
          return <Maps db={this.state.db_selected} mongodb={this.state.mongodb_selected} allTweetsData={this.state.allTweetsData}/>;
        case(6):
          return <LoadingData parentCallback = {this.getAllData.bind(this)} db={this.state.db_selected} mongodb={this.state.mongodb_selected}/>;
        case(7):
          return <PreLoader/>
      }
    }



 

    return (
      <div>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CrowdPulse</title>
        {/* Favicon */}
        {/* Custom styles */}
        <link rel="stylesheet" href="./css/style.css" />

        <link rel="stylesheet" 
      href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
      integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
      crossorigin=""/>
      
        <div className="layer" />
       
        <a className="skip-link sr-only" href="#skip-target">Skip to content</a>
        <div className="page-flex">

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
                    <a href="#export" onClick={() => {this.export()}}><span className="icon edit" aria-hidden="true" />Export</a>
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
                            <a href="#sentiment"  onClick={() => {this.displaySentimentCharts()}}>Sentiment</a>
                        </li>
                        <li>
                            <a href="#word" onClick={() => {this.displayWordCloud()}}>Word</a>
                        </li>
                        <li>
                            <a href="#timeLines" onClick={() => {this.displayTimeLines()}}>Timelines</a>
                        </li>
                        <li>
                            <a href="#tweetlist" onClick={() => {this.displayTweetList()}}>Tweet List</a>
                        </li>
                        <li>
                            <a href="#maps" onClick={() => {this.displayMaps()}}>Maps</a>
                        </li>
                    </ul>
                </li>

                
                <li>
                    <a class="show-cat-btn" href="###">
                        <span class="icon folder" aria-hidden="true"></span>Database
                        <span class="category__btn transparent-btn" title="Open list">
                            <span class="sr-only">Open list</span>
                            <span class="icon arrow-down" aria-hidden="true"></span>
                        </span>
                    </a>
                  
                      <Dbs data={this.state.dbs} parentCallback = {this.handleMongoDbChange.bind(this)}/>


                   
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



          {/*<PreLoader />*/}
          {renderContent()}

        

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
