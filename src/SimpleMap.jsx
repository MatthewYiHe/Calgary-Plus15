import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { pathFinder, nearestPoint } from './pathFinder.js';
import SearchBox from './SearchBox.jsx';
import Distance from './Distance.jsx';

const turf = require('@turf/helpers');


let geodesicPolyline;
let markersArr = [];
let pointOfInterests = [];
let distance;
// let defaultBounds;
let searchBound;

function Marker({category, lat, lng, text}){
  return (<div className="popup" >
            <img className="icon"
                 src={`/public/icons/${category}.png`}
                 onClick={() => window.helloComponent.changeRoute(lat, lng)}
                 />
            <span className="popuptext">{text}</span>
          </div>)
}


class SimpleMap extends Component {
  constructor(props) {
    super(props);
    window.helloComponent = this; // set helloComponent so "this" can be accessed outside of the class
    this.state = {
                  markers: [
                    {
                      name: "Me!",
                      icon: "./image/markerred.png",
                      lat: 51.04496400154897,
                      lng: -114.06487584114075
                    },
                    {
                      name: "Future ME!!",
                      icon: "./image/markergreen.png",
                      lat: 51.04496400154897,
                      lng: -114.06389776277542
                    }
                  ],
                  places: [],
                  center: {
                    lat: 51.04772950425881,
                    lng: -114.06795769929886
                  },
                  zoom: 16
    };
  }

  changeRoute (lat, lng){
    const { map, maps } = this.state;

    this.state.markers[1].lat = lat
    this.state.markers[1].lng = lng
    this.state.markers[1].icon = "./image/markergreen.png"
    this.state.markers[0].icon = "./image/markerred.png"
    this.forceUpdate()

    this.renderMarkers(map, maps)
    this.renderPolylines(map, maps)
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
        const json = require(`./data/${category}.geojson`)
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
    console.log('lat', e.latLng.lat(), 'lng', e.latLng.lng())
  }

  renderMarkers = (map, maps) => {
    console.log("markerObj",markersArr)

    if (markersArr.length) {
      for (var i = 0; i < markersArr.length; i++) {
        markersArr[i].setMap(null);
      }
    }
    this.state.markers.map(marker => {
      let markerObj = new maps.Marker({
        map: map,
        draggable: true,
        position: { lat: marker.lat, lng: marker.lng },
        title: marker.name,
        icon: marker.icon
      });
      markersArr.push(markerObj)
      markerObj.addListener('dragend', this.handleDragEnd(marker.name))
    })
  }


  renderPolylines = () => {
    const { map, maps } = this.state;
    if (geodesicPolyline) {
      geodesicPolyline.setMap(null)
    }
    //set distance to null, so Distance component will have distance as a false value if there no route
    this.setState({ distance: null})
      if (map && maps) {
        let route = pathFinder.findPath(
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

  getBounds = (places) => {
    const { map, maps } = this.state;
    let defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(51.04450531684381, -114.07904687929152),
      new google.maps.LatLng(51.050198081830814, -114.05770897865295)
      );
    searchBound = {bounds: defaultBounds}
  }

  searchMap = (places) => {
    console.log("state",this.state)
    const map = this.state.map
    const maps = this.state.maps
    pointOfInterests.forEach(function(pointOfInterest) {
      pointOfInterest.setMap(null);
    });
    pointOfInterests = [];
    let defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(51.04450531684381, -114.07904687929152),
      new google.maps.LatLng(51.050198081830814, -114.05770897865295)
      );
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      let icon = {
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
        defaultBounds.union(place.geometry.viewport);
      } else {
        defaultBounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(defaultBounds);
  }

  getGeoLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                console.log("Current Position:",position.coords);
                this.setState(prevState => ({
                    markers:
                        [
                          {
                            name: "Me!",
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            icon: "./image/markerred.png"
                          },
                          {
                            name: "Future ME!!",
                            lat: position.coords.latitude,
                            lng: position.coords.longitude + 0.001,
                            icon: "./image/markergreen.png"
                          }
                        ],
                    center: {
                        ...prevState.center,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                }))
            }
        )
    } else {
        error => console.log(error)
    }
  }

  render() {
    this.getGeoLocation()
    this.getBounds()
    return (
      <div className="map-div" >
        <SearchBox onPlacesChanged={this.searchMap} bounds={searchBound} />
        <GoogleMapReact
          bootstrapURLKeys={{ key:"AIzaSyCiU-c0OVTdlXbAj-24y8WY-09OB89AvGA"}}
          center={this.state.center}
          defaultZoom={this.state.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({map, maps}) => {
            // (new maps.KmlLayer("https://data.calgary.ca/api/geospatial/kp44-4n8q?method=export&format=KMZ")).setMap(map)
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
