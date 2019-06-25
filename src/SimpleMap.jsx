import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

import { pathFinder, nearestPoint } from './test.js';

const turf = require('@turf/helpers');
class SimpleMap extends Component {
  constructor() {
    super();
    this.state = {
                  markers: [
                    {
                      name: "Current position",
                      lat: 51.05,
                      lng: -114.06
                    },
                    {
                      name: "Destination",
                      lat: 51.04,
                      lng: -114.05
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

  handleDragEnd = (e) => {
    // this.setState({numberOfUsers: obj.numberOfUsers})
    console.log('lat', e.latLng.lat(), 'lng', e.latLng.lng())

  }

  renderMarkers = (map, maps) => {
    this.state.markers.map(marker => {
      const markerObj = new maps.Marker({
        map: map,
        draggable: true,
        position: { lat: marker.lat, lng: marker.lng },
        title: marker.name
      });
      markerObj.addListener('dragend', this.handleDragEnd)
    })
  }

  renderPolylines = (map, maps) => {
    const route = pathFinder.findPath(
      nearestPoint(turf.point([-114.05699592590332, 51.048570123455576])),
      nearestPoint(turf.point([-114.05980688095093, 51.045211088872335]))
    )
    if (route) {
      const path = route.path
      console.log("PATHHTHDSGD", JSON.stringify(path))
      let geodesicPolyline = new maps.Polyline({
        // path: [
        //   {lat:this.state.markers[0].lat, lng:this.state.markers[0].lng},
        //   {lat:this.state.markers[1].lat, lng:this.state.markers[1].lng}
        // ],
        path: path.map(latlng => ({ lat: latlng[1], lng: latlng[0] })),
        strokeColor: 'red',
        strokeOpacity: 1,
        strokeWeight: 5
      })
      geodesicPolyline.setMap(map)
    }
    console.log("Route after", route)

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

        </GoogleMapReact>
      </div>
    );
  }
}



export default SimpleMap;

// dont use this key: AIzaSyDrCXoSYA0GKWtl6I8K2QZDAhe9ryNnQkE


