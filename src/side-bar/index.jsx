import React, { Component } from 'react';
import './styles.scss'

function toggleSelectedCategory(category, selectedCategories, setSelectedCategories) {
  const on = selectedCategories.find(selectedCategory => selectedCategory === category)

  setSelectedCategories(prevState => {
    return  on
      ? prevState.filter(selectedCategory => selectedCategory !== category)
      : [...prevState, category]
  })
}


export default function SideBar({
  categories, selectedCategories, setSelectedCategories
}) {
  return(
    <nav className="nav">
      <div className="plus-15">+15</div>
      <ul className="side-bar">
      {
        categories.map(category => <li>
          <button
            onClick={() => toggleSelectedCategory(category, selectedCategories, setSelectedCategories)}
            style={{
              backgroundColor: selectedCategories.find(selectedCategory =>  selectedCategory === category)
                ? '#fff' : '#737982'
            }}
          >{ category }</button>
        </li>)
      }
      </ul>
    </nav>
  )
}

