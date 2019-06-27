import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ marker }) => <div>{marker}</div>;

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 51.047,
      lng: -114.068
    },
    zoom: 15.5
  };

  renderMarkers(map, maps) {
    let marker = new maps.Marker({
      map:map,
      draggable:true,
      animation: google.maps.Animation.DROP,
      position: {lat: 51.044921, lng: -114.064691},
      title:"Drag me!"
    });
  }

  render() {
    return (
      // Important! Always set the container height explicitly
      <div className="map-div">
        <GoogleMapReact
          bootstrapURLKeys={{ key:"AIzaSyBFruyJsEnujgDzqV9HybXjA6ySEahuwJU" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({map, maps}) => {
            map.data.loadGeoJson('./Plus15.geojson')
            this.renderMarkers(map, maps)
            map.data.setStyle({

            fillColor: 'blue',
            strokeColor: 'blue',
            strokeWeight: '2 px'

            });
          }}
        >
          <AnyReactComponent
            lat={51.044921}
            lng={-114.064691}
            text="My Marker"
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;
// AIzaSyBFruyJsEnujgDzqV9HybXjA6ySEahuwJU - ours
// AIzaSyDrCXoSYA0GKWtl6I8K2QZDAhe9ryNnQkE&amp - brads
