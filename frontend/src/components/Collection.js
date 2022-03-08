import React from 'react';

class Collection extends React.Component {
    
    constructor(props){
        super(props)
        this.handleDbChange = this.handleDbChange.bind(this)
       
        console.log(props.data)
    }

    handleDbChange = (db) => {
        
        this.props.parentCallback(db);  
            
      }


    render() {
        
        return(
            <ul class="cat-sub-menu">
            {this.props.data.map((object, i)=>{
                return <li>
                <a href="#" onClick={() => {this.handleDbChange(object)}}>{object}</a>
            </li>;
            
            })}
                               
        </ul>
        )
    }


}

export default Collection;