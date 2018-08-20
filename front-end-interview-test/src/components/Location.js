import React, { Component } from 'react';

class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const locationItems = this.props.locations.map(location => (
      <div key={location.id}>
        <h3>{location.address}</h3>
        <p>{location.beds}</p>
        <p>{location.baths}</p>
        <p>{location.buildingType.name}</p>
      </div>
    ));

    return (
      <div>
        <h1>Locations</h1>
        {locationItems}
      </div>
    );
  }
}

export default Location;
