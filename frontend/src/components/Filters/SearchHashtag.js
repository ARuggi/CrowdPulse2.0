import React from 'react'
import ReactTags from 'react-tag-autocomplete'
import './css/searchbar.css';

class SearchHashtag extends React.Component {

  constructor (props) {
    super(props);
    this.sendData = this.sendData.bind(this);
    this.state = {
      hashtags: [],
      suggestions: [],
    }

    this.getHashtags();
  }

  getHashtags() {
    const data = this.props.allHashtags.data;
    const strings = [];
    const tempSuggestion = [];

    for (const element of data) {

      if (element._id.hashtag === undefined) {
        continue;
      }

      for (const hashtag of element._id.hashtags) {
        if (strings.indexOf(hashtag) === -1) {
          tempSuggestion.push({
                id: 0,
                name: hashtag,
              }
          );
          strings.push(hashtag);
        }
      }
    }

    this.state.suggestions = tempSuggestion;
    this.setState({suggestions: tempSuggestion});
    this.reactTags = React.createRef();
  }

  componentDidUpdate(prevProps, prevState , snapshot) {
    if (prevProps.mongodb !== this.props.mongodb) {
      this.getHashtags();
    }
  }

  sendData(hashtags) {
    this.props.parentCallback(hashtags);
  }

  onDelete(i) {
    const hashtags = this.state.hashtags.slice(0);
    hashtags.splice(i, 1);
    this.setState({hashtags});
    this.sendData(hashtags);
  }

  onAddition(hashtag) {
    const hashtags = [].concat(this.state.hashtags, hashtag);
    this.setState({hashtags});
    this.sendData(hashtags);
  }

  render () {
    return (
        <ReactTags
            placeholderText="Add new Hashtag"
            ref={this.reactTags}
            tags={this.state.hashtags}
            suggestions={this.state.suggestions}
            onDelete={this.onDelete.bind(this)}
            onAddition={this.onAddition.bind(this)}
            allowNew={true}
            classNames="search"
        />
    );
  }
}

export default SearchHashtag;