import React, { Component } from 'react';
import './styles.scss'

function toggleSelectedCategory(category, selectedCategories, setSelectedCategories) {
  const on = selectedCategories.find(selectedCategory => selectedCategory === category)

  setSelectedCategories(prevState => {
    return  on ? prevState.filter(selectedCategory => selectedCategory !== category) : [...prevState, category]
  })
}


export default function SideBar({
  categories, selectedCategories, setSelectedCategories
}) {
  return(
    <nav className="nav">
      <div className="plus-15">+15</div>
      <ul className="nav-item">
      {
        categories.map(category => <li>
          <button className="nav-button"
            onClick={() => toggleSelectedCategory(category, selectedCategories, setSelectedCategories)}
            style={{
              backgroundColor: selectedCategories.find(selectedCategory =>  selectedCategory === category)
                ? '#737982' : '#9fa4ad'
            }}
          >{ category }</button>
        </li>)
      }
      </ul>
    </nav>
  )
}

