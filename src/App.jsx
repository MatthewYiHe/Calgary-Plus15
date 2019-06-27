import React, {Component} from 'react';
import SimpleMap from './SimpleMap.jsx';
import SideBar from './SideBar.jsx'

class App extends Component {
  render() {
    return (
      <section>
      <div className="container">
      <SimpleMap />
      <SideBar />
      </div>


      </section>

    );
  }
}
export default App;
