import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Test from './CHANGEME.js';
import apiObj from './API.js';
//import Location from './components/Location.js';
//const axios = require('axios');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      buildingTypes: [],
      subscriptionPlans: [],
      users: []
    }
  }

  axiosRequest() {
    let self = this;

    apiObj.getLocations().then((response) => {
      self.setState({locations: response.data});
    }).catch((error) => {
      console.log(error);
    });
    apiObj.getBuildingTypes().then((response) => {
      self.setState({buildingTypes: response.data});
    }).catch((error) => {
      console.log(error);
    });
    // axios.get('http://localhost:8001/locations').then((response) => {
    //   self.setState({locations: response.data});
    //   // console.log(response.status);
    // }).catch((error) => {
    //   console.log(error);
    // });
    //
    // axios.get('http://localhost:8001/buildingTypes').then((response) => {
    //   self.setState({buildingTypes: response.data});
    // }).catch((error) => {
    //   console.log(error);
    // });
    // axios.get('http://localhost:8001/subscriptionPlans').then((response) => {
    //   self.setState({subscriptionPlans: response.data});
    // }).catch(function (error) {
    //   console.log(error);
    // });
    //
    // axios.get('http://localhost:8001/user').then((response) => {
    //   self.setState({users: response.data});
    // }).catch(function (error) {
    //   console.log(error);
    // });
  }

  componentDidMount() {
    this.axiosRequest();
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Remine Frontend Developer Test</h2>
        </div>
        {/*
        <p className="App-intro">Congratulations!! You have gotten farther than 75% of our applicants. Dont stop here!</p>
        <p>Do what you need to do to get this table to render filtered and fast.</p>
        */}
        <Test properties={this.state.locations} buildingTypes={this.state.buildingTypes} />
        {/*<Location locations={this.state.locations} />*/}
      </div>
    );
  }
}

export default App;
