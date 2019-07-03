import React, { Component } from 'react';

class Distance extends Component {
  render(){
    let distance = this.props.distance
    console.log("distance",distance)
    return (
      <div className="test">
        {distance && (
          <div className="distance">
            Distance: {distance}m &emsp;
            Time: {Math.round(distance/1000 * 12.5)}mins
          </div>
          )}
      </div>
    )
  }
}
export default Distance;