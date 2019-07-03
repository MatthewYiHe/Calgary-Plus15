import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export default class SearchBox extends React.Component {

  render() {
    return(
        <div className="searchContainer">
          <FontAwesomeIcon icon={faSearch} style={{"color":"grey","margin":"6px auto auto 10px","position":"absolute"}} />
          <input className="searchbox" ref="input" {...this.rest} type="text" placeholder=" Search here" />
        </div>
      )
    }
  onPlacesChanged = () => {
    if (this.props.onPlacesChanged) {
      this.props.onPlacesChanged(this.searchBox.getPlaces());
    }
  }
  componentDidMount() {
    let searchBound = this.props.bounds
    var input = ReactDOM.findDOMNode(this.refs.input);
    this.searchBox = new google.maps.places.SearchBox(input, searchBound);
    this.searchBox.addListener('places_changed', this.onPlacesChanged);
  }
  componentWillUnmount() {
    // https://developers.google.com/maps/documentation/javascript/events#removing
    google.maps.event.clearInstanceListeners(this.searchBox);
  }
}