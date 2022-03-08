import Filters from './Filters/TimeLinesFilters';
import React from 'react';
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
      this.query()
      this.setState({flag:1})
    
    }
  

      query = () =>{
        var dataGroupByDates=[{
          id:null,
          counter:null
        }]

        var i = 0
        var j = 0
        
        if(this.state.data.length!==0){
          var dt = this.state.data[0].created_at.substring(0, 10)
          dataGroupByDates[0].id=dt

          while(i<this.state.data.length){

            if(dataGroupByDates[j].id===this.state.data[i].created_at.substring(0, 10)){
              dataGroupByDates[j].counter++
            }else{
                j++
                dataGroupByDates.push({
                  id :this.state.data[i].created_at.substring(0, 10),
                  counter:0
                })
           
            }
            i++
          }
          
        }

        this.setState({dataGroupByDates : dataGroupByDates})
        this.state.dataGroupByDates=dataGroupByDates
        
      }
   
    
      render () {
        var body;

        if(this.state.flag>0){
          body=            <div className="row">
          <div className="col-lg-12">
            <div className="chart">
              <TimeLineChart data={this.state.dataGroupByDates}/>
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
      )
      }

}
export default TweetList