import React from 'react'
import ReactTags from 'react-tag-autocomplete'
import './css/searchbar.css';

//https://www.npmjs.com/package/react-tag-autocomplete
class SearchFilters extends React.Component {

  constructor(props) {
    super(props);
    this.sendData = this.sendData.bind(this);
    this.state = {
      tags: [],
      suggestions: [],
    };

    this.getTags();
  }

  getTags() {
    const data = this.props.allTags.data;
    const tempSuggestion = [];
    const strings = [];

    for (const element of data) {

      if (element._id === undefined || element._id === null) {
        continue
      }

      for (const tagMe of element._id.tag_me) {
        let temp = tagMe.split(" : ");

        if (strings.indexOf(temp[0]) === -1) {
          tempSuggestion.push({
            id: temp[1],
            name: temp[0],
          });
          strings.push(temp[0]);
        }
      }
    }

    this.state.suggestions = tempSuggestion;
    this.setState({suggestions: tempSuggestion});
    this.reactTags = React.createRef();
  }

  componentDidUpdate(prevProps, prevState , snapshot) {
    if (prevProps.mongodb !== this.props.mongodb) {
      this.getTags();
    }
  }

  sendData(tags) {
    this.props.parentCallback(tags);
  }

  onDelete(i) {
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({tags});
    this.sendData(tags);
  }

  onAddition(tag) {
    const tags = [].concat(this.state.tags, tag);
    this.setState({tags});
    this.sendData(tags);
  }

  render() {
    return (
        <ReactTags
            ref={this.reactTags}
            tags={this.state.tags}
            suggestions={this.state.suggestions}
            onDelete={this.onDelete.bind(this)}
            onAddition={this.onAddition.bind(this)}
            allowNew={true}
            classNames="search"
        />
    );
  }
}

export default SearchFilters;