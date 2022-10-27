import React from 'react';
import Filters from './Filters/TimeLinesFilters';
import TimeLineChart from './Charts/TimeLineChart';
import PreLoader from "./preloader";

class TweetList extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      totalTweets: 0,
      flagType: 0,
      counter : [],
      data: [],
      dataGroupByDates:[],
      flag: 0
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.db !== this.props.db) {
      this.setState({flag: 0});
    }
  }

  handleQuery(data) {
    this.setState({data: data});
    this.state.data = data;
    this.state.totalTweets = data.length;
    this.query();
    this.setState({flag: 1});
  }


  query() {
    const dataGroupByDates = [{
      id: null,
      counter: null,
    }];

    if (this.state.data.length !== 0) {

      dataGroupByDates[0].id = this.state.data[0].created_at.substring(0, 10);
      let index = 0

      for (const data of this.state.data) {

        if (dataGroupByDates[index].id === data.created_at.substring(0, 10)) {
          dataGroupByDates[index].counter++;
        } else {
          dataGroupByDates.push({id: data.created_at.substring(0, 10), counter: 0})
          index++;
        }
      }

    }

    this.setState({dataGroupByDates})
    //this.state.dataGroupByDates = dataGroupByDates
  }


  render () {
    let body;

    if (this.state.flag > 0) {
      body = (
          <div className="row">
            <div className="col-lg-12">
              <div className="chart">
                <TimeLineChart data={this.state.dataGroupByDates}/>
              </div>
            </div>
          </div>
      );
    } else {
      body = (
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
              <h3>Time Line - {this.props.mongodb} </h3>
              <br/>
              <Filters  parentCallback = {this.handleQuery.bind(this)} db={this.props.db} tweetsData={this.props.allTweetsData} />
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

export default TweetList;