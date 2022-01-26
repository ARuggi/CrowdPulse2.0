import Filters from './Filters/Filters'
import React from 'react';
import DisplayTable from './Table/TweetsTable';
import PreLoader from "./preloader";

class TweetList extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
          totalTweets: 0,
          data: [],
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
      this.state.totalTweets = data.length
      this.setState({flag:1})
    
    }


   
    
      render () {
        var body;
        if(this.state.flag>0){
          body=<div className="row">
          <div className="col-lg-12">
            <div className="chart">
              <DisplayTable data={this.state.data}/>
            </div>
          </div>

        </div>
        }else{
          body=            <div className="row">
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
            <h3>Tweet List - {this.props.db} </h3>
            <br/>
            <Filters parentCallback = {this.handleQuery.bind(this)} db= {this.props.db} />
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
export default TweetList