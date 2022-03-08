import React from 'react';

class Dbs extends React.Component {
    
    constructor(props){
        super(props)
        this.handleMongoDbChange = this.handleMongoDbChange.bind(this)

        }

    handleMongoDbChange = (db) => {

        this.props.parentCallback(db);  
            
      }


    render() {
        
        return(
            <ul class="cat-sub-menu">

            

            {this.props.data.map((object, i)=>{
                return <li>
                <a href="#" onClick={() => {this.handleMongoDbChange(object)}}>{object}</a>
            </li>;
            
            })}
                               
        </ul>
        )
    }


}

export default Dbs;