import React, { Component } from 'react';
import './styles.scss'

function toggleSelectedCategory(category, selectedCategories, setSelectedCategories) {
  const on = selectedCategories.find(selectedCategory => selectedCategory === category)

  setSelectedCategories(prevState => {
    return  on ? prevState.filter(selectedCategory => selectedCategory !== category) : [...prevState, category]
  })
}

// function insertIcon(category) {
//   let result = ""
//   category.forEach(function(elm){
//     if (elm === "coffee") return "coffeeee"
//       else if (elm === "food") return "foooood"
//         else if (elm === "banks") return "banksssss"
//     })
//   return (<p>${result}</p>)
//   }
// // const category = ["coffee", "food", "banks"]

export default function SideBar({
  categories, selectedCategories, setSelectedCategories, insertIcon
}) {
  return(
    <nav className="nav">
      <div className="plus-15">+15</div>
      <ul className="nav-item">
      {
        categories.map(category => <li>
          <button className="nav-button"
            onClick={() => toggleSelectedCategory(category, selectedCategories, setSelectedCategories, insertIcon)}
            style={{ backgroundColor: selectedCategories.find(selectedCategory =>  selectedCategory === category) ? '#737982' : '#9fa4ad' }}
          ><img className="button-icon" src={`/public/button-icons/${category}-button.png`} />{ category }</button>
        </li>)
      }
      </ul>
    </nav>
  )
}

