import React, { Component } from 'react';
class SideBar extends Component {
  constructor(){
    super();
  }
  render(){
    return (
      <nav className="nav">
        <div className="plus-15">+15</div>
        <div className="nav-item"><i className="material-icons md-48">shopping_cart</i>
        shopping

        <label className="switch">
        <input type="checkbox"></input>
        <span className="slider"></span>
        </label>

        </div>
        <div className="nav-item"><i className="material-icons md-48">local_dining</i>reastaurants</div>
        <div className="nav-item"><i className="material-icons md-48">account_balance</i>banking</div>
      </nav>
    )
  }
}
export default SideBar;