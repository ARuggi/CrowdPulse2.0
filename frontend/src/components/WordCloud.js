import React from 'react';

import ReactWordCloud from 'react-wordcloud';

import Filters from './Filters/WordChartFilters'
import PreLoader from "./preloader";

class WordCloud extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      data:[],
      words:[{
        text: null,
        value: null
      }],
      flag: 0,
      flagWord: 0
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.db !== this.props.db) {
      this.setState({flag: 0});
    }
  }

  handleQuery(temp) {

    this.setState({data: temp.data});
    this.state.data = temp.data;
    this.state.flagWord = temp.typeWord;

    if (this.state.flagWord === 0 || this.state.flagWord === '0') {
      this.queryText();
    } else if (this.state.flagWord === 1 || this.state.flagWord === '1') {
      this.queryTag();
    } else {
      this.queryHashtag();
    }

    this.state.flag = 1;
    this.setState({flag: 1});
  }

  queryTag() {

    const words = [{
      text: null,
      value: 0,
    }];
    const arrayWords = [];

    for (const data of this.state.data) {

      if (data.tags === undefined) {
        continue;
      }

      for (const tag_me of data.tags.tag_me) {

        const temp = tag_me.split(' : ')[0];
        const k = arrayWords.findIndex(value => value === temp);

        if (k >= 0) {
          words[k].value++;
        } else {
          arrayWords.push(temp);
          words.push({
            text: temp,
            value: 1,
          });
        }
      }
    }

    //this.state.words = words;
    this.setState({words});
    this.setState({flag: 1});
  }

  queryHashtag() {

    const words = [{
      text: null,
      value: 0,
    }];
    const arrayWords = [];

    for (const data of this.state.data) {

      if (data.twitter_entities.hashtags === undefined) {
        continue;
      }

      for (const hashtag of data.twitter_entities.hashtags){

        const k = arrayWords.findIndex(value => value === hashtag);

        if (k >= 0){
          words[k].value++;
        } else {
          arrayWords.push(hashtag);
          words.push({
            text: hashtag,
            value: 1,
          });
        }
      }
    }

    //this.state.words = words;
    this.setState({words});
    this.setState({flag: 1});
  }

  queryText() {

    const words = [{
      text: null,
      value: 0
    }];
    const arrayWords = [];
    let index = 1;

    for(const data of this.state.data) {

      //check spacy not null
      if (data.spacy === undefined) {
        continue;
      }

      for (const processed_text of data.spacy.processed_text) {

        const temp = processed_text.split(" ")[0];

        //check word
        if(this.checkWord(temp) === false
            && processed_text.split(" ")[3] !== 'CCONJ') {

          //check if the word has already been counted
          if (arrayWords[temp] === undefined) {
            words.push({
              text: temp,
              value: 1,
            });
            arrayWords[temp] = index;
            index++;
          } else {
            try {
              words[arrayWords[temp]].value++;
            } catch (error) {
              // nothing to do?
              // console.error(error);
            }
          }
        }
      }
    }

    //this.state.words = words;
    this.setState({words});
    this.setState({flag: 1});
  }

  checkWord(temp) {

    //check if is a character
    if (temp.length === 1){
      return true;
    }
    //check if string is a tag
    if (temp[0] === '@'){
      return true;
    }

    //check if string is a number
    if (!isNaN(temp)) {
      return true;
    }

    //check if word is a stop-word
    //'zr' is the last word of stopwords.json
    /*
    var i = 0;
    while(stopWords[i]!=='zr'){
      if(temp===stopWords[i]){
        return true;
      }
      i++;
    }
    */

    //Check if word starts with https.
    const pattern = new RegExp('^(https?|ftp)://');
    if (pattern.test(temp)) {
      return true;
    }

    //Check if word is an emoji.
    const regexExp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
    return regexExp.test(temp);
  }

  render() {

    const renderContent = () => {
      return <Filters parentCallback = {this.handleQuery.bind(this)} db = {this.props.db}  tweetsData={this.props.allTweetsData}/>;
    }

    const temp = renderContent();
    let body;
    let filters;

    if (temp !== null) {
      filters = temp;
    } else {
      filters = <PreLoader/>;
    }

    if (this.state.flag > 0) {
      body = (
          <div className="row">
            <div className="col-lg-12">
              <div className="CloudChart" id="wordChart">
                <ReactWordCloud words={this.state.words} options={{
                  fontFamily: 'monospace',
                  rotations: 1,
                  rotationAngles: [0],
                  fontSizes: [20, 60],
                }} />
              </div>
            </div>
          </div>
      );
    } else {
      body= (
          <div className="row">
            <div className="col-lg-12">
              <div className="chart"> <PreLoader/></div>
            </div>
          </div>
      );
    }
    return (
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
    );
  }
}

export default WordCloud;