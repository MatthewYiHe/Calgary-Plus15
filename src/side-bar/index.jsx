import React, { Component } from 'react';
import './styles.scss'

function toggleSelectedCategory(category, selectedCategories, setSelectedCategories) {
  const on = selectedCategories.find(selectedCategory => selectedCategory === category)

  setSelectedCategories(prevState => {
    return  on ? prevState.filter(selectedCategory => selectedCategory !== category) : [...prevState, category]
  })
}


export default function SideBar({
  categories, selectedCategories, setSelectedCategories, insertIcon
}) {
  return(
    <nav className="nav">
      <div className="plus-15"><img className="logo" src={`/public/logo/logo.png`} /></div>
      <ul className="nav-item">
      {
        categories.map(category => <li>
          <button className="nav-button"
            onClick={() => toggleSelectedCategory(category, selectedCategories, setSelectedCategories, insertIcon)}
            style={{ backgroundColor: selectedCategories.find(selectedCategory =>  selectedCategory === category) ? '#064466' : '#396985' }}
          ><img className="button-icon" src={`/public/button-icons/${category}-button.png`} />{ category }</button>
        </li>)
      }
      </ul>


    </nav>
  )
}
