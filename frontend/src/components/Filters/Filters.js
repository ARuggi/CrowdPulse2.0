import SearchUser from './SearchUser';
import SearchFilters from './SearchFilters';
import SearchText from './SearchText';
import SearchHashtag from './SearchHashtag';
import React, { useEffect } from 'react';

class Filters extends React.Component {

  constructor(props) {
    super(props);
    this.query = this.query.bind(this);
    this.state = {
      totalTweets: 0,
      flagType: 0,
      flagSentiment: 0,
      counter: [],
      oldData: [],
      data: [],
      tags: [],
      text: [],
      users: [],
      hashtags: [],
      fromDate: null,
      toDate: null,
    }

    this.getData(this.props.tweetsData.dataSortByDate.data);
    this.state.totalTweets = this.props.tweetsData.dataSortByDate.data.length;
    this.query();
  }

  componentDidUpdate(prevProps, prevState , snapshot) {
    if (prevProps.mongodb !== this.props.mongodb) {
      this.getData(this.props.tweetsData.dataSortByDate.data);
    }
  }

  getData(allData) {
    const data = allData;
    this.state.data = allData;
    this.state.oldData = allData;
    this.setState({totalTweets: data.length});
    this.query();
  }

  // DATES FILTERS

  handleFromDatesChanges(event) {
    if (event.target.value !== "") {
      this.state.fromDate = event.target.value;

      if (this.state.data.length === 0) {
        this.state.data = this.state.oldData;
        this.filterDataByDates();
        this.resetFilter();
      } else {
        this.filterDataByDates();
      }

    } else {
      this.resetFilter();
    }
  }

  handleToDatesChanges(event) {
    if (event.target.value !== "") {
      this.state.toDate = event.target.value;

      if (this.state.data.length === 0) {
        this.state.data= this.state.oldData;
        this.filterDataByDates();
        this.resetFilter();
      } else {
        this.filterDataByDates();
      }

    } else {
      this.resetFilter();
    }
  }

  filterDataByDates() {
    let index = 0;
    const tempData = [];

    if (this.state.fromDate === null) {

      // set Data
      for (const element of this.state.data) {
        if (element.created_at < this.state.toDate) {
          tempData[index++] = element;
        }
      }

    } else if (this.state.toDate === null) {

      // save filtered data
      for (const element of this.state.data) {
        if (element.created_at > this.state.fromDate) {
          tempData[index++] = element;
        }
      }

    } else {

      // set Data
      for (const element of this.state.data) {
        if (element.created_at > this.state.fromDate
            && element.created_at < this.state.toDate) {
          tempData[index++] = element;
        }
      }
    }

    this.state.data = tempData;
    this.handleQuery()
  }

  // END DATES FILTERS
  // TAGS SECTION

  handleTags(tags) {
    this.state.tags = tags;

    if (tags.length > this.state.tags.length) {
      this.filterByTags(tags);
      this.handleQuery();
    } else {
      this.resetFilter();
    }
  }

  filterByTags(tags) {

    let index = 0;
    const tempData = [];

    for (const element of this.state.data) {

      if (element.tags === undefined) {
        continue;
      }

      for (const tagMe of element.tags.tag_me) {
        let temp = tagMe.split(" : ");
        let flag = false;

        for (const tag of tags) {
          flag = temp.some(a => a.includes(tag.name)) === true;
        }

        if (flag === true) {
          tempData[index++] = element;
        }
      }
    }

    this.state.data = tempData;
    this.state.totalTweets = tempData.length;
    this.handleQuery();
  }

  // TEXT SECTION

  handleText(text) {
    this.state.text = text;

    if (text.length > this.state.text.length) {
      this.filterByText(text);
      this.handleQuery();
    } else {
      this.resetFilter();
    }
  }

  filterByText(text) {
    let index = 0;
    const tempData = [];

    for (const element of this.state.data) {

      if (element.spacy === undefined) {
        continue
      }

      for (const processedText of element.spacy.processed_text) {
        let temp = processedText.split(" ");
        let flag = false;

        for (const t of text) {
          flag = temp.some(a => a.includes(t.name)) === true;
        }

        if (flag === true) {
          tempData[index++] = element;
        }
      }
    }

    this.state.data = tempData;
    this.state.totalTweets = tempData.length;
    this.handleQuery();
  }

  // HASHTAGS SECTION

  handleHashtags(hashtags) {
    if (hashtags.length > this.state.hashtags.length) {
      this.state.hashtags = hashtags;
      this.filterByHashtags(hashtags);
      this.handleQuery();
    } else {
      this.state.hashtags = hashtags;
      this.resetFilter();
    }
  }

  filterByHashtags(hashtags) {
    let index = 0;
    const tempData = [];

    for (const element of this.state.data) {

      if (element.twitter_entities === undefined
          || element.twitter_entities.hashtags === undefined) {
        continue;
      }

      for (const hashtagEntity of element.twitter_entities.hashtags) {
        let flag = false;

        for (const hashtag of hashtags) {
          flag = hashtagEntity === hashtag.name;
        }

        if (flag === true) {
          tempData[index++] = element;
        }
      }
    }

    this.state.data = tempData;
    this.state.totalTweets = tempData.length;
    this.handleQuery();
  }

  // USERS SECTION

  handleUsers(users) {
    if (users.length > this.state.users.length) {
      this.state.users = users;
      this.filterByUser(users);
      this.handleQuery();
    } else {
      this.state.users = users;
      this.resetFilter();
    }
  }

  filterByUser(users) {
    let index = 0;
    const tempData = [];

    for (const element of this.state.data) {
      let flag = false;

      for (const user of users) {
        if (element.author_name === user.name) {
          flag = true; break;
        }
      }

      if (flag === true) {
        tempData[index++] = element;
      }
    }

    this.state.data = tempData;
    this.state.totalTweets = tempData.length;
    this.handleQuery(); //TODO: chiamata di questo metodo mancante, accertarsi che vada bene
  }

  //RESET SECTION

  resetFilter() {
    this.state.data = this.state.oldData;

    if (this.state.fromDate !== null || this.state.toDate !== null) {
      this.filterDataByDates();
    }

    if (this.state.tags.length !== 0) {
      this.filterByTags(this.state.tags);
    }

    if (this.state.hashtags.length !== 0) {
      this.filterByHashtags(this.state.hashtags);
    }

    if (this.state.text.length !== 0) {
      this.filterByText(this.state.text);
    }

    if (this.state.users.length !== 0) {
      this.filterByUser(this.state.users);
    }

    this.handleQuery();
  }

  // CATEGORY

  handleCategory(event) {
    if (this.state.flagType !== 0 && this.state.flagSentiment !== 0) {
      this.state.flagType = event.target.value;
      this.state.data = this.state.oldData;
      this.resetFilter();
      this.filterByCategory();
    } else if (event.target.value === 0 && this.state.flagSentiment === 0) {
      this.state.flagType = event.target.value ;
      this.state.data = this.state.oldData;
      this.resetFilter();
    } else {
      this.state.flagType = event.target.value;
      this.filterByCategory();
    }
  }

  handleSentiment(event) {
    if (this.state.flagType !== 0 && this.state.flagSentiment !== 0) {
      this.state.flagSentiment = event.target.value;
      this.state.data = this.state.oldData;
      this.resetFilter();
      this.filterByCategory();
    } else if (this.state.flagType === 0 && event.target.value === 0) {
      this.state.flagSentiment = event.target.value;
      this.state.data = this.state.oldData;
      this.resetFilter();
    } else {
      this.state.flagSentiment = event.target.value;
      this.filterByCategory();
    }
  }

  filterByCategory() {

    let index = 0;
    const temp = [];
    let flagAll = 0;

    if (this.state.flagType===0 || this.state.flagType==='0') {
      if (this.state.flagSentiment === 1 || this.state.flagSentiment === '1') {

        for (const element of this.state.data) {

          if (element.sentiment === undefined) {
            flagAll = 0; continue;
          }

          if (element.sentiment['sent-it'] !== undefined
              && element.sentiment['sent-it'].sentiment === 'positive') {
            temp[index++] = element;
            flagAll = 1;
          }

          if (element.sentiment['feel-it'] !== undefined
              && element.sentiment['feel-it'].sentiment === 'positive'
              && flagAll === 0) {
            temp[index++] = element;
          }
        }

      } else if (this.state.flagSentiment === 2 || this.state.flagSentiment === '2') {

        for (const element of this.state.data) {

          if (element.sentiment === undefined) {
            flagAll = 0; continue;
          }

          if (element.sentiment['sent-it'] !== undefined
              && element.sentiment['sent-it'].sentiment === 'neutral') {
            temp[index++] = element;
            flagAll = 1;
          }

          if (element.sentiment['feel-it'] !== undefined
              && element.sentiment['feel-it'].sentiment === 'neutral'
              && flagAll === 0) {
            temp[index++] = element;
          }
        }

      } else if (this.state.flagSentiment === 3 || this.state.flagSentiment === '3' ) {

        for (const element of this.state.data) {

          if (element.sentiment === undefined) {
            flagAll = 0; continue;
          }

          if (element.sentiment['sent-it'] !== undefined
              && element.sentiment['sent-it'].sentiment === 'negative') {
            temp[index++] = element;
            flagAll = 1;
          }

          if (element.sentiment['feel-it'] !== undefined
              && element.sentiment['feel-it'].sentiment === 'negative'
              && flagAll === 0) {
            temp[index++] = element;
          }
        }
      }

      //Category Sent-it
    } else if (this.state.flagType === 1 || this.state.flagType === '1') {

      if (this.state.flagSentiment === 0 || this.state.flagSentiment ==='0') {

        for (const element of this.state.data) {
          if (element.sentiment !== undefined
              && element.sentiment['sent-it'] !== undefined) {
            temp[index++] = element;
          }
        }

      } else if (this.state.flagSentiment === 1 || this.state.flagSentiment === '1') {

        for (const element of this.state.data) {
          if (element.sentiment !== undefined
              && element.sentiment['sent-it'] !== undefined
              && element.sentiment['sent-it'].sentiment === 'positive') {
            temp[index++] = element;
          }
        }

      } else if (this.state.flagSentiment === 2 || this.state.flagSentiment === '2') {

        for (const element of this.state.data) {
          if (element.sentiment !== undefined
              && element.sentiment['sent-it'] !== undefined
              && element.sentiment['sent-it'].sentiment === 'neutral') {
            temp[index++] = element;
          }
        }

      } else if (this.state.flagSentiment === 3 || this.state.flagSentiment === '3') {

        for (const element of this.state.data) {
          if (element.sentiment !== undefined
              && element.sentiment['sent-it'] !== undefined
              && element.sentiment['sent-it'].sentiment === 'negative') {
            temp[index++] = element;
          }
        }
      }

      //Category Feel-it
    } else {

      if (this.state.flagSentiment === 0 || this.state.flagSentiment === '0') {

        for (const element of this.state.data) {
          if (element.sentiment !== undefined
              && element.sentiment['feel-it'] !== undefined) {
            temp[index++] = element;
          }
        }

      } else if (this.state.flagSentiment === 1 || this.state.flagSentiment === '1') {

        for (const element of this.state.data) {
          if (element.sentiment !== undefined
              && element.sentiment['feel-it'] !== undefined
              && element.sentiment['feel-it'].sentiment==='positive') {
            temp[index++] = element;
          }
        }

      } else if (this.state.flagSentiment === 2 || this.state.flagSentiment === '2') {

        for (const element of this.state.data) {
          if (element.sentiment !== undefined
              && element.sentiment['feel-it'] !== undefined
              && element.sentiment['feel-it'].sentiment==='neutral') {
            temp[index++] = element;
          }
        }

      } else if (this.state.flagSentiment === 3 || this.state.flagSentiment === '3') {

        for (const element of this.state.data) {
          if(element.sentiment !== undefined
              && element.sentiment['feel-it'] !== undefined
              && element.sentiment['feel-it'].sentiment === 'negative') {
            temp[index++] = element;
          }
        }
      }
    }

    this.state.data = temp;
    this.handleQuery();
  }

  // QUERY SECTION

  handleQuery() {

    if (this.state.data.length === 0) {
      this.state.totalTweets = 0;
    } else {
      this.state.totalTweets = this.state.data.length;
    }

    this.query();
  }

  query() {
    this.props.parentCallback(this.state.data);
  }

  render() {
    return (
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
        </>
    );
  }
}

export default Filters;