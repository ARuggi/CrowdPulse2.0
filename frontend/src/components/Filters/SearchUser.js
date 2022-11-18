import React from 'react'
import ReactTags from 'react-tag-autocomplete'
import './css/searchbar.css';

class SearchUser extends React.Component {

  constructor(props) {
    super(props);
    this.sendData = this.sendData.bind(this);
    this.state = {
      users: [],
      suggestions: [],
    };

    this.getUser();
  }

  getUser() {
    const data = this.props.allUser.data;
    const strings = [];
    const tempSuggestion = [];

    for(const element of data) {

      if (strings.indexOf(element._id) === -1) {
        tempSuggestion.push({
              id: 0,
              name: element._id,
            }
        );
        strings.push(element._id);
      }
    }

    this.state.suggestions = tempSuggestion;
    this.setState({suggestions: tempSuggestion});
    this.reactTags = React.createRef();
  }

  componentDidUpdate(prevProps, prevState , snapshot) {
    if (prevProps.mongodb !== this.props.mongodb){
      this.getHashtags();
    }
  }

  sendData(users) {
    this.props.parentCallback(users);
  }

  onDelete(i) {
    const users = this.state.users.slice(0);
    users.splice(i, 1);
    this.setState({users});
    this.sendData(users);
  }

  onAddition(user) {
    const users = [].concat(this.state.users, user);
    this.setState({users});
    this.sendData(users);
  }

  render() {
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
    );
  }
}

export default SearchUser;