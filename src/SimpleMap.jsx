import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { pathFinder, nearestPoint } from './pathFinder.js';
import SearchBox from './SearchBox.jsx';


const turf = require('@turf/helpers');

let geodesicPolyline;
let pointOfInterests = [];

class SimpleMap extends Component {
  constructor() {
    super();
    this.state = {
                  markers: [
                    {
                      name: "Current position",
                      lat: 51.04496400154897,
                      lng: -114.06487584114075,
                      icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                    },
                    {
                      name: "Destination",
                      lat: 51.04496400154897,
                      lng: -114.06389776277542,
                      icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                    }
                  ]
    };
  }

  static defaultProps = {
    center: {
      lat: 51.04772950425881,
      lng: -114.06795769929886
    },
    zoom: 15.5
  };

  setMapReference = (map,maps) => this.setState({ map: map, maps: maps });

  handleDragEnd = name => (e) => {
    // same as:
    // handleDragEnd (name){
    //   return function handleDragEnd (e) {
    //   }
    // }
    if (geodesicPolyline) {
      geodesicPolyline.setMap(null)
    }
    const markers = [ ...this.state.markers ]
    const index = markers.findIndex(mark => mark.name === name);
    markers[index] = {
      name,
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    }
    this.setState({ markers })
    this.renderPolylines();
    console.log('lat', e.latLng.lat(), 'lng', e.latLng.lng())
  }

  renderMarkers = (map, maps) => {
    this.state.markers.map(marker => {
      const markerObj = new maps.Marker({
        map: map,
        draggable: true,
        position: { lat: marker.lat, lng: marker.lng },
        title: marker.name,
        icon: marker.icon
      });
      markerObj.addListener('dragend', this.handleDragEnd(marker.name))
    })
  }

  renderPolylines = () => {
    const { map, maps } = this.state;
      if (map && maps) {
        const route = pathFinder.findPath(
        nearestPoint(turf.point([this.state.markers[0].lng, this.state.markers[0].lat])),
        nearestPoint(turf.point([this.state.markers[1].lng, this.state.markers[1].lat]))
        )
        if (route) {
          const path = route.path
          console.log(route.weight * 1000, 'm')
            geodesicPolyline = new maps.Polyline({
            path: path.map(latlng => ({ lat: latlng[1], lng: latlng[0] })),
            strokeColor: 'red',
            strokeOpacity: 1,
            strokeWeight: 5
          })
          geodesicPolyline.setMap(map)
        }}
  }

  searchMap = (places) => {
    const map = this.state.map
    const maps = this.state.maps
    pointOfInterests.forEach(function(pointOfInterest) {
      pointOfInterest.setMap(null);
    });
    pointOfInterests = [];
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      pointOfInterests.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  }

  render() {
    return (
      <div className="map-div" >
        <SearchBox onPlacesChanged={this.searchMap}/>
        <GoogleMapReact
          bootstrapURLKeys={{ key:"AIzaSyCiU-c0OVTdlXbAj-24y8WY-09OB89AvGA"}}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({map, maps}) => {
            (new maps.KmlLayer("https://data.calgary.ca/api/geospatial/kp44-4n8q?method=export&format=KMZ")).setMap(map)
            // (new google.maps.KmlLayer("https://github.com/MatthewYiHe/Plus-Fifteen-App/blob/master/Tims.kmz?raw=true")).setMap(map)
            // map.data.loadGeoJson('./Plus15.geojson')
            this.renderMarkers(map, maps)
            this.setMapReference(map, maps)
            // this.maps = maps
          }}
        >
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;