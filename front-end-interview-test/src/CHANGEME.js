import React, { Component } from 'react';
import RemineTable from './components/Table/RemineTable/RemineTable';
import PropTypes from 'prop-types';
import './style/changeme.css';

/**
 * NOTES: To selected multiple values for the building types select box:
 *    1) click + hold down left click + drag in a direction
 *    2) hold shift + click 
 *
 * IMPORTANT: All methods contain extremely redudant code that should be refactored
 * and to promote readability, code reuse, by utilizing shared function helpers
 * that make use of component state appropriately.
 *
 * IMPORTANT: setState() should not be called as frequently as it is throughout this coding exercise
 * due to the nature of asynchronous function calls.
 */
class Test extends Component {
  // initialize state
  constructor(props) {
    super(props);
    this.state = {
      properties: [],
      address: '',
      buildingTypes: [],
      bedLowSelect: 'All',
      bedUpSelect: 'All',
      bathLowSelect: 'All',
      bathUpSelect: 'All'
    };

    // bind functions to state context
    this.filterAddress = this.filterAddress.bind(this);
    this.handleBedChange = this.handleBedChange.bind(this);
    this.handleBathChange = this.handleBathChange.bind(this);
    this.handleBuildChange = this.handleBuildChange.bind(this);
    this.reset = this.reset.bind(this);

    //this.filterBuildingType = this.filterBuildingType.bind(this);
    //this.filterBath = this.filterBath.bind(this);
    //this.filterBed = this.filterBed.bind(this);
    //this.handleChange = this.handleChange.bind(this);
  }

  // legacy method and should not be used
  componentWillReceiveProps(props) {
    this.setState({properties: props.properties});

    let buildings = props.buildingTypes;
    let newBuildings = [{id: 6, name: 'All'}];
    let allBuildings = newBuildings.concat(buildings);
    this.setState({buildingTypes: allBuildings});
  }

  // method to replace componentWillReceiveProps(props)
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (nextProps.properties !== prevState.properties) {
  //     return ({ properties: nextProps.properties }); // <- setState() equivalent
  //   }
  // }

  // filter properties based on single substring
  filterAddress(event) {
    let filtered = this.props.properties.filter(property => {
      return property.address.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1;
    });
    this.setState({properties: filtered});
    this.setState({address: event.target.value});
    this.setState({buildingTypes: [{id: 6, name: 'All'}],
    bedLowSelect: 'All',
    bedUpSelect: 'All',
    bathLowSelect: 'All',
    bathUpSelect: 'All'});
  }

  // filter properties based on user specified bed range
  handleBedChange(event) {
    // check for invalid user entry
    let lowBed = (this.state.bedLowSelect === 'All') ? 0 : this.state.bedLowSelect;
    let upBed = (this.state.bedUpSelect === 'All') ? 100 : this.state.bedUpSelect;

    if (event.target.id === 'bedLowSelect' && event.target.value > upBed && event.target.value !== 'All') {
      //alert(`Please enter a valid range for ${lowBed} and ${upBed}`);
      alert(`${event.target.value} > ${upBed}. Please enter a valid range for the lower bound of your bed range.`);
      return;
    }
    if (event.target.id === 'bedUpSelect' && event.target.value < lowBed && event.target.value !== 'All') {
      // alert(`Please enter a valid range for ${lowBed} and ${upBed}`);
      alert(`${event.target.value} < ${lowBed}. Please enter a valid range for the upper bound of your bed range.`);
      return;
    }

    this.setState({address: ''});

    // update select box value
    this.setState({[event.target.id] : event.target.value});

    // retrieve current bath range
    let filtered = [];
    let lowBath = (this.state.bathLowSelect === 'All') ? 0 : this.state.bathLowSelect;
    let upBath =  (this.state.bathUpSelect === 'All') ? 100 : this.state.bathUpSelect;

    // determine buildingTypes that are selected
    let selected = (this.state.buildingTypes === []) ? ['All'] : this.state.buildingTypes;
    let all = this.props.properties;
    let selProps = [];

    // determine properties with matching buildingType
    if (selected[0].name === 'All') {
      selProps = all;
    } else {
      for (let ii = 0; ii < all.length; ii++) {
        for (let jj = 0; jj < selected.length; jj++) {
          if (all[ii].buildingType.name === selected[jj]) {
            selProps.push(all[ii]);
          }
        }
      }
    }

    // is this display all?   ex: 'All' option
    if (event.target.value === 'All') {
      let baseAtt = event.target.id;
      let updateAtt = (baseAtt.indexOf('Low') !== -1) ? baseAtt.replace('Low', 'Up'): baseAtt.replace('Up', 'Low');
      this.setState({[baseAtt]: 'All', [updateAtt]: 'All'});

      filtered = selProps.filter(property => {
        return property.beds >= 0 && property.baths >= lowBath && property.baths <= upBath;
      });
    } else { // is user updating upper or lower bound for bed range?
      if (event.target.id.indexOf('Up') !== -1) {
        this.setState({bedUpSelect: event.target.value});
        let bound = (this.state.bedLowSelect === 'All') ? 0 : this.state.bedLowSelect;
        filtered = selProps.filter(property => {
          return property.beds <= event.target.value && property.beds >= bound && property.baths >= lowBath && property.baths <= upBath;
        });
      } else if (event.target.id.indexOf('Low') !== -1) {
        this.setState({bedLowSelect: event.target.value});
        let bound = (this.state.bedUpSelect === 'All') ? 100 : this.state.bedUpSelect;
        filtered = selProps.filter(property => {
          return property.beds >= event.target.value && property.beds <= bound && property.baths >= lowBath && property.baths <= upBath;
        });
      }
    }

    // update properties shown
    this.setState({properties: filtered});
  }

  // filter properties based on user specified bath range
  handleBathChange(event) {
    // check for invalid user entry
    let lowBath = (this.state.bathLowSelect === 'All') ? 0 : this.state.bathLowSelect;
    let upBath = (this.state.bathUpSelect === 'All') ? 100 : this.state.bathUpSelect;

    if (event.target.id === 'bathLowSelect' && event.target.value > upBath && event.target.value !== 'All') {
      //alert(`Please enter a valid range for ${lowBath} and ${upBath}`);
      alert(`${event.target.value} > ${upBath}. Please enter a valid range for the lower bound of your bath range.`);
      return;
    }
    if (event.target.id === 'bathUpSelect' && event.target.value < lowBath && event.target.value !== 'All') {
      //alert(`Please enter a valid range for ${lowBath} and ${upBath}`);
      alert(`${event.target.value} > ${lowBath}. Please enter a valid range for the upper bound of your bath range.`);
      return;
    }

    this.setState({address: ''});

    // update select box value
    this.setState({[event.target.id] : event.target.value});

    // retrieve current bed range
    let filtered = [];
    let lowBed = (this.state.bedLowSelect === 'All') ? 0 : this.state.bedLowSelect;
    let upBed =  (this.state.bedUpSelect === 'All') ? 100 : this.state.bedUpSelect;

    // determine buildingTypes that are selected
    let selected = (this.state.buildingTypes === []) ? ['All'] : this.state.buildingTypes;
    let all = this.props.properties;
    let selProps = [];

    // determine properties with matching buildingType
    if (selected[0].name === 'All') {
      selProps = all;
    } else {
      for (let ii = 0; ii < all.length; ii++) {
        for (let jj = 0; jj < selected.length; jj++) {
          if (all[ii].buildingType.name === selected[jj]) {
            selProps.push(all[ii]);
          }
        }
      }
    }

    // is this display all?   ex: 'All' option
    if (event.target.value === 'All') {
      let baseAtt = event.target.id;
      let updateAtt = (baseAtt.indexOf('Low') !== -1) ? baseAtt.replace('Low', 'Up'): baseAtt.replace('Up', 'Low');
      this.setState({[baseAtt]: 'All', [updateAtt]: 'All'});
      filtered = selProps.filter(property => {
        return property.baths >= 0 && property.beds >= lowBed && property.beds <= upBed;
      });
    } else { // is user updating upper or lower bound for bath range?
      if (event.target.id.indexOf('Up') !== -1) {
        this.setState({bathUpSelect: event.target.value});
        let bound = (this.state.bathLowSelect === 'All') ? 0 : this.state.bathLowSelect;
        filtered = selProps.filter(property => {
          return property.baths <= event.target.value && property.baths >= bound && property.beds >= lowBed && property.beds <= upBed;
        });
      } else if (event.target.id.indexOf('Low') !== -1) {
        this.setState({bathLowSelect: event.target.value});
        let bound = (this.state.bathUpSelect === 'All') ? 100 : this.state.bathUpSelect;
        filtered = selProps.filter(property => {
          return property.baths >= event.target.value && property.baths <= bound && property.beds >= lowBed && property.beds <= upBed;
        });
      }
    }

    // update properties shown
    this.setState({properties: filtered});
  }

  // filter properties based on user specified bath range
  handleBuildChange(event) {
    this.setState({address: ''});
    let options = event.target.options;
    let selected = [];
    let displayAll = false;
    let filtered = [];

    // retrieve current bed and bath range
    let lowBath = (this.state.bathLowSelect === 'All') ? 0 : this.state.bathLowSelect;
    let upBath = (this.state.bathUpSelect === 'All') ? 100 : this.state.bathUpSelect;
    let lowBed = (this.state.bedLowSelect === 'All') ? 0 : this.state.bedLowSelect;
    let upBed =  (this.state.bedUpSelect === 'All') ? 100 : this.state.bedUpSelect;

    // determine buildingTypes that are selected
    for (let ii = 0; ii < options.length; ii++) {
      if (options[ii].selected) {
        selected.push(options[ii].value);
        if (options[ii].value === 'All') {
          displayAll = true;
        }
      }
    }

    // update select box values
    this.setState({buildingTypes: selected});

    // is this display all?   ex: 'All' option
    if (displayAll) {
      filtered = this.props.properties.filter(property => {
        return property.baths >= lowBath && property.baths <= upBath && property.beds >= lowBed && property.beds <= upBed;
      });
    } else {
      // determine properties with matching buildingType
      let all = this.props.properties;
      let selProps = [];
      for (let ii = 0; ii < all.length; ii++) {
        for (let jj = 0; jj < selected.length; jj++) {
          if (all[ii].buildingType.name === selected[jj]) {
            selProps.push(all[ii]);
          }
        }
      }

      // determine properties that match current range
      filtered = selProps.filter(property => {
        return property.baths >= lowBath && property.baths <= upBath && property.beds >= lowBed && property.beds <= upBed;
      });
    }

    // update properties shown
    this.setState({properties: filtered});
  }

  reset() {
    //console.log('Hit reset');
    this.setState({properties: this.props.properties});
    this.setState({address: ''});
    this.setState({buildingTypes: [{id: 6, name: 'All'}] });
    //console.log(this.state.buildingTypes);
    this.setState({bedLowSelect: 'All', bedUpSelect: 'All', bathLowSelect: 'All', bathUpSelect: 'All'});
  }

  render() {
    // create 'All' option and '1' to '100' inclusive options
    let defaultOption = [{id: 0, name: 'All'}];
    let bbDefault = ['All'];

    let nums = [];
    for (let ii = 1; ii <= 100; ii++) {
      nums.push(ii);
    }

    // add 'All' option to buiding types and bed / bath select box options
    let buildingOptions = defaultOption.concat(this.props.buildingTypes);
    let bedbathOptions = bbDefault.concat(nums);

    // create HTML option components for select boxes
    let buildingText = buildingOptions.map(buildingType => {
      return (
        <option key={buildingType.id} value={buildingType.name}>{buildingType.name}</option>
      );
    });

    let bedbathText = bedbathOptions.map(num => {
      return (
        <option key={num} value={num}>{num}</option>
      );
    });

    let quickStyle = {
      color: 'white',
      margin: '12px'
    };

    return (
      <div className="testContainer">
        <div className="filterContainer">
          <h3 className="filterHeader">Preferences</h3>
            <div className="filterButtons">
              <form>
                <p className="filterCaption">Street Address</p>
                <input type="text" className="addressFilter" value={this.state.address} onChange={this.filterAddress} placeholder="Enter an address" />
              </form>
              <span style={quickStyle}>OR</span>
              {/*<input type="text" className="buildingFilter" onChange={this.filterBuildingType} placeholder="Enter a building type" />*/}
              {/*<input type="text" className="bathFilter" onChange={this.filterBath} placeholder="Enter # of baths" />*/}
              {/*<input type="text" className="bedFilter" onChange={this.filterBed} placeholder="Enter # of beds" />*/}

              <form>
                <p className="filterCaption">Building Types</p>
                <select id="buildingTypes" multiple={true} name="buildingType" size="6" value={this.state.buildingTypes} onChange={this.handleBuildChange}>
                  {buildingText}
                </select>
              </form>
              <form>
                <p className="filterCaption">Beds</p>
                <select id="bedLowSelect" size="1" name="beds" value={this.state.bedLowSelect} onChange={this.handleBedChange}>
                  {bedbathText}
                </select>
              </form>
              <form>
                <p className="filterCaption">Beds</p>
                <select id="bedUpSelect" size="1" name="beds" value={this.state.bedUpSelect} onChange={this.handleBedChange}>
                  {bedbathText}
                </select>
              </form>
              <form>
                <p className="filterCaption">Baths</p>
                <select id="bathLowSelect" name="baths" size="1" value={this.state.bathLowSelect} onChange={this.handleBathChange}>
                  {bedbathText}
                </select>
              </form>
              <form>
                <p className="filterCaption">Baths</p>
                <select id="bathUpSelect" name="baths" size="1" value={this.state.bathUpSelect} onChange={this.handleBathChange}>
                  {bedbathText}
                </select>
              </form>
              <button onClick={this.reset}>Reset</button>
            </div>
        </div>
        <RemineTable properties={this.state.properties} />
      </div>
    );
  }
}

RemineTable.defaultProps = {
    properties: []
}

RemineTable.propTypes = {
    properties: PropTypes.array
}

export default Test;

// filterBuildingType(event) {
//   let filtered = this.props.properties.filter(property => {
//     //console.log(property.buildingType.name);
//     return property.buildingType.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1;
//   });
//   this.setState({properties : filtered});
// }
//
// filterBath(event) {
//   if (event.target.value === '') {
//     this.setState({properties: this.props.properties});
//   } else {
//     let filtered = this.props.properties.filter(property => {
//       return property.baths === parseInt(event.target.value, 10);
//     });
//     this.setState({properties: filtered});
//   }
// }
//
// filterBed(event) {
//   if (event.target.value === '') {
//     this.setState({properties: this.props.properties});
//   } else {
//     let filtered = this.props.properties.filter(property => {
//       return property.beds === parseInt(event.target.value, 10);
//     });
//     this.setState({properties: filtered});
//   }
// }

// attempt to update all attributes in single method
// handleChange(event) {
//   // update select box value
//   this.setState({[event.target.id] : event.target.value});
//   let filtered = [];
//   is this display all?   ex: 'All' option
//   if (event.target.value === 'All') {
//     let baseAtt = event.target.id;
//     let updateAtt = (baseAtt.indexOf('Low') !== -1) ? baseAtt.replace('Low', 'Up'): baseAtt.replace('Up', 'Low');
//     let bedbath = (baseAtt.indexOf('bed') !== -1) ? 'beds' : 'baths';
//     filtered = this.props.properties.filter(property => {
//       return property[bedbath] >= 0;
//     });
//     // set both select box values to 'All'
//     this.setState({[event.target.id] : 'All', [updateAtt]: 'All'});
//   } else { // is this display a range?   ex: '1' bath to '2' bath
//     if (event.target.id.indexOf('Up') !== -1) {
//       filtered = this.state.properties.filter(property => {
//         return property[event.target.name] <= event.target.value;
//       });
//     } else if (event.target.id.indexOf('Low') !== -1) {
//       filtered = this.state.properties.filter(property => {
//         return property[event.target.name] >= event.target.value;
//       });
//     }
//   }
//
//   // update properties shown
//   this.setState({properties: filtered});
// }
