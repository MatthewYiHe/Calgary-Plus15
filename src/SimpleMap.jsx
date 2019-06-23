import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ marker }) => <div>{marker}</div>;

class SimpleMap extends Component {
  constructor() {
    super();
    this.state = {
                  markers: [
                    {
                      name: "Current position",
                      position: {
                        lat: 51.05,
                        lng: -114.06
                      }
                    }
                  ]
    };
  }

  static defaultProps = {
    center: {
      lat: 51.044921,
      lng: -114.064691
    },
    zoom: 15
  };

  renderMarkers = (map, maps) => {
    let marker = new maps.Marker({
      map:map,
      draggable:true,
      position: {lat: this.state.markers[0].position.lat, lng: this.state.markers[0].position.lng},
      title:"Drag me!"
    });
  }

  renderPolylines (map, maps) {
    // let position = marker.getPosition()
    // let lat = position.lat()
    // let lng = position.lng()
    let geodesicPolyline = new maps.Polyline({
      path: [
        {lat:51.05, lng:-114.06},
        {lat:51.045, lng:-114.062}
      ],
      strokeColor: 'red',
      strokeOpacity: 1,
      strokeWeight: 5
    })
    geodesicPolyline.setMap(map)
  }



  render() {
    return (
      <div style={{ height: '80vh', width: '100%'}}>
        <GoogleMapReact
          bootstrapURLKeys={{ key:"AIzaSyBFruyJsEnujgDzqV9HybXjA6ySEahuwJU"}}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({map, maps}) => {
            map.data.loadGeoJson('./Plus15.geojson')
            this.renderMarkers(map, maps)
            this.renderPolylines(map, maps)
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

