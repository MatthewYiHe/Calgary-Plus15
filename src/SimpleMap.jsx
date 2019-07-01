import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { pathFinder, nearestPoint } from './pathFinder.js';
import SearchBox from './SearchBox.jsx';
import Distance from './Distance.jsx';

const turf = require('@turf/helpers');


function Marker({category, lat, lng}){
  return <img className="icon" src={`/public/icons/${category}.png`} />
}

let geodesicPolyline;
let pointOfInterests = [];
let distance;

class SimpleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
                  markers: [
                    {
                      name: "Me!",
                      lat: 51.04496400154897,
                      lng: -114.06487584114075,
                      icon: "./image/markerred.png"
                    },
                    {
                      name: "Future ME!!",
                      lat: 51.04496400154897,
                      lng: -114.06389776277542,
                      icon: "./image/markergreen.png"
                    }
                  ],
                  places: []
    };

  }

  componentWillReceiveProps = (props) => {
    console.log('selectedCategories', props.selectedCategories)
    this.loadSelectedPlaces(props.selectedCategories)
  }

  componentWillMount()  {
    this.loadSelectedPlaces(this.props.selectedCategories)
  }

  loadSelectedPlaces = (categories) => {
    this.setState({
      places: categories.flatMap(category => {
        const json = require(`./data/${category}.json`)
        return json.features.map(place => {
          return ({
            name: place.properties.name,
            lat: place.geometry.coordinates[1],
            lng: place.geometry.coordinates[0],
            category: category
          })
        })
      })
    })
  }

  static defaultProps = {
    center: {
      lat: 51.04772950425881,
      lng: -114.06795769929886
    },
    zoom: 16
  };

  setMapReference = (map,maps) => this.setState({ map: map, maps: maps });

  // same as:
  // handleDragEnd (name){
  //   return function handleDragEnd (e) {
  //   }
  // }
  handleDragEnd = name => (e) => {
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
    // console.log('lat', e.latLng.lat(), 'lng', e.latLng.lng())
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
    //set distance to 0, so Distance component will have distance as a false value if there no route
    this.setState({ distance: 0})
      if (map && maps) {
        const route = pathFinder.findPath(
        nearestPoint(turf.point([this.state.markers[0].lng, this.state.markers[0].lat])),
        nearestPoint(turf.point([this.state.markers[1].lng, this.state.markers[1].lat]))
        )
        if (route) {
          const path = route.path
          let distance = Math.floor(route.weight * 1000)
          this.setState({ distance: distance})
            geodesicPolyline = new maps.Polyline({
            path: path.map(latlng => ({ lat: latlng[1], lng: latlng[0] })),
            strokeColor: 'blue',
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
            // (new maps.KmlLayer("https://data.calgary.ca/api/geospatial/kp44-4n8q?method=export&format=KMZ")).setMap(map)
            // (new google.maps.KmlLayer("https://github.com/MatthewYiHe/Plus-Fifteen-App/blob/master/Tims.kmz?raw=true")).setMap(map)
            // map.data.loadGeoJson('./Plus15.geojson')

            map.data.loadGeoJson('./Plus15.geojson')
            map.data.setStyle({
              fillColor: '#2254a3',
              fillOpacity: 0.5,
              strokeWeight: 1,
              strokeColor: '#2254a3',
              strokeOpacity: 0.5
            })
            this.renderMarkers(map, maps)
            this.setMapReference(map, maps)
          }}
        >
         {
          this.state.places.map((place, i) => <Marker
              id={place.name}
              key={i}
              lat={place.lat}
              lng={place.lng}
              text={place.name}
              category={place.category}
            />)
        }
        </GoogleMapReact>
        <Distance distance={this.state.distance} />
      </div>
    );
  }
}



export default SimpleMap;
