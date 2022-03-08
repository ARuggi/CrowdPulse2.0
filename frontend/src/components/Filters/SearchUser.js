import React from 'react'
import ReactTags from 'react-tag-autocomplete'
import './css/searchbar.css';




class SearchUser extends React.Component {
  constructor (props) {
    super(props)
    this.sendData = this.sendData.bind(this)
    this.state = {
        users: [     
      ],
      suggestions: [
       
      ]
    }
     
    this.getUser();
  }

  getUser = () => {
    var i = 0;
    
    const data = this.props.allUser.data;
    var strings = [];
   
    var tempSuggestion = []
    //console.log("hashtags"+data[0])
    while(i<data.length){
      

   
          if(strings.indexOf(data[i]._id)==-1){
            tempSuggestion.push(
              {
                id:0,
                name: data[i]._id
              }
            )
            strings.push(data[i]._id);
          }    
     


        i++
    }
    
    this.state.suggestions = tempSuggestion
    this.setState({suggestions: tempSuggestion})
    

    this.reactTags = React.createRef()
  }


  componentDidUpdate(prevProps) {
    if(prevProps.mongodb!==this.props.mongodb){
      this.getHashtags();
    }
    
  }


  sendData = (users) =>{
    this.props.parentCallback(users);
  }

  onDelete (i) {
    const users = this.state.users.slice(0)
    users.splice(i, 1)
    this.setState({ users })
    this.sendData(users)
  }

  onAddition (user) {
    const users = [].concat(this.state.users, user)
    this.setState({ users })
    this.sendData(users)
  }

  render () {
    return (
     
      <ReactTags
        placeholderText="Add new Username"
        ref={this.reactTags}
        tags={this.state.users}
        suggestions={this.state.suggestions}
        onDelete={this.onDelete.bind(this)}
        onAddition={this.onAddition.bind(this)} 
        allowNew={true}
        classNames="search"
        />
     

    )
  }
}


export default SearchUser