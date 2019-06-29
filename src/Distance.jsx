import React, { Component } from 'react';

class Distance extends Component {
  render(){
    let distance = this.props.distance
    return (
      <div>
        {distance && (
          <div className="distance">
            Distance: {distance}m<br/>
            Time: {Math.round(distance/1000 * 12.5)}mins
          </div>
          )}
      </div>
    )
  }
}
export default Distance;