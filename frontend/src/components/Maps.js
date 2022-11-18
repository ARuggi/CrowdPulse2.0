import React from 'react';

import Filters from './Filters/Filters'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'

import PreLoader from "./preloader";
import HeatmapLayer from "react-leaflet-heatmap-layer/lib/HeatmapLayer";
import citta from "../it.json";

class Maps extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data :[],
      markers: [],
      flag: 0,
      heatPoints: [],
      content: 0,
      counter: 0,
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.db !== this.props.db) {
      this.setState({flag: 0});
    }
  }

  handleQuery(data) {
    this.setState({data: data});
    //this.state.data = data
    this.query();
    this.setState({flag: 1});
  }

  query() {

    const markers = [];
    const heatPoints = [];
    let counter = 0;

    for (const data of this.state.data) {

      if (data.geo === undefined) {
        continue;
      }

      const geo = data.geo;
      counter++;

      if (geo.coordinates !== undefined) {

        const coords = geo.coordinates;

        markers.push({
          lat: coords.latitude,
          lng: coords.longitude,
          text: data.raw_text,
          author: data.author_username,
        })

        heatPoints.push([coords.latitude, coords.longitude, 100]);

      } else {

        //Get coordinates from city name
        for (const c of citta) {

          if (c.city !== geo.user_location) {
            continue;
          }

          markers.push({
            lat: c.lat,
            lng: c.lng,
            text: data.raw_text,
            author: data.author_username,
          });

          heatPoints.push([c.lat, c.lng, 100]);
          break;
        }
      }
    }

    this.setState({counter});
    this.setState({markers});
    //this.state.markers=markers
    this.setState({heatPoints});
    //this.state.heatPoints=heatPoints;
  }

  displayMap() {
    this.setState({content: 0});
    //this.state.content = 0;
  }

  displayHeatMap() {
    this.setState({content: 1});
    //this.state.content = 1;
  }

  render () {
    let body;

    if (this.state.flag > 0) {
      if (this.state.content === 0) {
        body = (
            <>
              <div className="row">
                <div className="col-lg-12">
                  <div className="chart" id="mapCanvas">
                    <Map center={[41.29246 ,13.5736108]} zoom={5} scrollWheelZoom={false}>
                      {this.state.markers.map((city, idx) => (
                          <Marker position={[city.lat, city.lng]} key={idx}>
                            <Popup>
                              <b>
                                {city.author}, {city.text}
                              </b>
                            </Popup>
                          </Marker>))}
                      <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    </Map>
                  </div>
                </div>
              </div>
            </>
        );
      } else {
        body = (
            <>
              <div className="row">
                <div className="col-lg-12">
                  <div className="chart" id="mapCanvas">
                    <Map center={[41.29246 ,13.5736108]} zoom={5}>
                      <HeatmapLayer
                          points={this.state.heatPoints}
                          longitudeExtractor={m => m[1]}
                          latitudeExtractor={m => m[0]}
                          intensityExtractor={m => parseFloat(m[2])} />
                      <TileLayer
                          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      />
                    </Map>
                  </div>
                </div>
              </div>
            </>
        );
      }
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
              <h3>Maps - {this.props.mongodb} </h3>
              <br/>
              <Filters parentCallback = {this.handleQuery.bind(this)} db = {this.props.db}  tweetsData={this.props.allTweetsData}/>
              <br/>
              <button className='button activeButton' onClick={() => {this.displayMap()}} > Map</button>
              <button className='button activeButton' onClick={() => {this.displayHeatMap()}} > Heat Map</button>
              <b>Tweet Geolocalizzati : {this.state.counter}</b>
              <br/><br/><br/>
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

export default Maps;