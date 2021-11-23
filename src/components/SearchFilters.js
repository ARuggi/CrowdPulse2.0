import React from 'react'
import ReactTags from 'react-tag-autocomplete'
import '../searchbar.css';

//https://www.npmjs.com/package/react-tag-autocomplete
class SearchFilters extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      tags: [
        
      ],
      suggestions: [
        { id: 3, name: "Covid" },
        { id: 4, name: "Pandemia" },
        { id: 5, name: "Covid19" },
        { id: 6, name: "PAndemia" }
      ]
    }

    this.reactTags = React.createRef()
  }

  onDelete (i) {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    this.setState({ tags })
  }

  onAddition (tag) {
    const tags = [].concat(this.state.tags, tag)
    this.setState({ tags })
  }

  render () {
    return (
     
      <ReactTags
        ref={this.reactTags}
        tags={this.state.tags}
        suggestions={this.state.suggestions}
        onDelete={this.onDelete.bind(this)}
        onAddition={this.onAddition.bind(this)} 
        classNames="searh"
        />
     

    )
  }
}


export default SearchFilters