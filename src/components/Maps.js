//https://react-leaflet.js.org/docs/start-installation/

import Filters from './Filters/Filters'
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import PreLoader from "./preloader";


class Maps extends React.Component {
  constructor(props){
    super(props)
    

    this.state = {
      data:[],
      markers : [],
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
    this.setState({flag:1})
  
  }

      query = () => {
        var i = 0
       
        var markers = []

        
        while(i<this.state.data.length){
          if(this.state.data[i].geo!==undefined){
            
            if(this.state.data[i].geo.coordinates!==undefined){

              markers.push({
                lat:this.state.data[i].geo.coordinates.latitude,
                lng:this.state.data[i].geo.coordinates.longitude,
                text:this.state.data[i].raw_text,
                author:this.state.data[i].author_username
              })
             
            }
            
            i++
          }else{
            i++
          }
        }
        
        this.setState({markers:markers})
        this.state.markers=markers

        
        
      }
    
      render () {
        var body;

        if(this.state.flag>0){

           body=              <div className="row">
           <div className="col-lg-12">
             <div className="chart" id="mapCanvas">
             <MapContainer center={[41.29246 ,13.5736108]} zoom={6} scrollWheelZoom={false}>
             {this.state.markers.map((city, idx) => (
             <Marker
               position={[city.lat, city.lng]}
               key={idx}
             >
               <Popup>
                 <b>
                   {city.author}, {city.text}
                 </b>
               </Popup>
             </Marker>))}
                 <TileLayer
                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

             </MapContainer>
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
            <h3>Maps - {this.props.db} </h3>
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
export default Maps