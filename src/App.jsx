import React, { useState } from 'react';
import SimpleMap from './SimpleMap.jsx';
import SideBar from './side-bar/index.jsx';

const categories = ['banks', 'coffee']

export default function App() {
  const [selectedCategories, setSelectedCategories] = useState([])
  return (
    <section>
    <div className="container">
      <SimpleMap
        categories={categories}
        selectedCategories={selectedCategories}
      />
      <SideBar
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
    </div>
    </section>
  );
}