import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ marker }) => <div>{marker}</div>;

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 51.044921,
      lng: -114.064691
    },
    zoom: 15
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
      <div style={{ height: '80vh', width: '50%'}}>
        <GoogleMapReact
          bootstrapURLKeys={{ key:"AIzaSyBFruyJsEnujgDzqV9HybXjA6ySEahuwJU"}}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({map, maps}) => {
            map.data.loadGeoJson('./Plus15.geojson')
            this.renderMarkers(map, maps)
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
