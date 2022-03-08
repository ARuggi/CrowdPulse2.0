import React from 'react';
import dbImg from '../img/1.jpg';
import dataImg from '../img/2.jpg';
import queryImg from '../img/3.jpg';
class Home extends React.Component {

    render() {
        return(

                        
        <div className="main-wrapper">

        {/* ! Main */}
        <main className="main users chart-page" id="skip-target">
          <div className="container">
            <h1 className="homeTitle">CrowdPulse Dashboard</h1>
            <br/><br/><br/><br/><br/><br/><br/>
            <h3>Prima di utilizzare il sistema devi selezionadre un DB</h3><br/><br/><br/>
            <div className="row">

                <div className="col-lg-4 howBox">

                    <div className="how">
                        <img src={dbImg}/>
                        <br/>
                    <b>1</b><br/>

                        Seleziona il Db che vuoi analizzare    
                    </div>
                </div>
                <div className="col-lg-4 howBox">
                    <div className="how">
                    <img src={dataImg}/>
                    <br/>
                       <b>2</b>
                       <br/>

                        Selezioni i grafici che ti interessano
                    </div>
                </div>
                <div className="col-lg-4 howBox">
                    <div className="how">
                    <img src={queryImg}/>
                    <br/>
                    <b>3</b>
                       <br/>
                        Utilizza i filtri per essere più preciso 
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

export default Home;