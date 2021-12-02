import Filters from './Filters/Filters'
import React from 'react';
import DisplayTable from './Table/TweetsTable';

class TweetList extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
          totalTweets: 0,
          data: [],
      }
      
      
    }

    handleQuery = (data) => {
    
      this.setState({data:data})
      this.state.data = data
      this.state.totalTweets = data.length
      
    
    }


   
    
      render () {
          return(
        <div className="main-wrapper">
        {/* ! Main */}
        <main className="main users chart-page" id="skip-target">
          <div className="container">
            <h1>CrowdPulse</h1>
            <br/>
            <h3>Tweet List - {this.props.db} </h3>
            <br/>
            <Filters parentCallback = {this.handleQuery.bind(this)}/>
            <br/>
            <div className="row">
              <div className="col-lg-12">
                <div className="chart">
                  <DisplayTable data={this.state.data}/>
                </div>
              </div>

            </div>

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