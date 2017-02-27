import './FiltersSection.styl';
import React from 'react';
// import ReactTooltip from 'react-tooltip';
import ReactDOM from 'react-dom';
import Filter from './Filter.jsx';
import { guid } from '../../../../utils/generalUtils.jsx';
import { constructFilterEventData,
         filterEventsAreDifferent } from './utils.jsx';
import { convertPropsMetadataToDrodownObject } from '../utils.jsx';

// FILTER MEMORY
var memory = {
  filterSettings: {},
  lastFilterEventData: null
};

class FiltersSection extends React.Component {
  constructor(props){
    super();
    this.fields = convertPropsMetadataToDrodownObject(props.propsMd);
    const defaultFeatureCount = window.geojson.features.length
    this.state = {
      filterIds: Object.keys(memory.filterSettings),
      featureCountMessage: `Showing All ${defaultFeatureCount} Tracts`
    }
    this.handleAddFilter = this.handleAddFilter.bind(this);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
    this.spinAddFilterButton = this.spinAddFilterButton.bind(this);
    this.updateFilterSettingsMemory = this.updateFilterSettingsMemory.bind(this);
    document.addEventListener('UPDATE_FILTER_SECTION', this.updateFeatureCount.bind(this));
  }

  handleAddFilter(){
    var filterIds = this.state.filterIds;
    if (this.state.filterIds.length < 3){
      // ADD A NEW FILTER TO THE STATE'S LIST
      const newFilterId = guid();
      filterIds.push(newFilterId);
      // memory.filterSettings[newFilterId] = defaultFilterSetting;
      this.setState({
        filterIds: filterIds
      });
      this.spinAddFilterButton('right');
    }
  }

  handleRemoveFilter(filterId){
    var filterIds = [...this.state.filterIds];
    filterIds.splice(filterIds.indexOf(filterId), 1);
    // if the removed filter is available in the lastFilterEventData -- it should be removed and filter event should be pushed through
    delete memory.filterSettings[filterId];
    this.determineFilterEventFire();
    this.setState({
      filterIds: filterIds
    });
    this.spinAddFilterButton('left');
  }

  updateFilterSettingsMemory(filterId, filterState){
    const lastMemory = Object.assign({}, memory.filterSettings[filterId]);
    memory.filterSettings[filterId] = filterState;
    if ( !filterState.freezeFilterValidity ) {
      this.determineFilterEventFire();
    }
  }

  determineFilterEventFire(){
    const filterEventData = constructFilterEventData(memory.filterSettings);
    if (memory.lastFilterEventData !== null){
      if (filterEventsAreDifferent(memory.lastFilterEventData, filterEventData)){
        const evt = new CustomEvent('FILTER', {'detail': filterEventData})
        document.dispatchEvent(evt);
      }
    }
    memory.lastFilterEventData = filterEventData;
  }

  updateFeatureCount(e){
    const subtotal = e.detail.numFeaturesInFilter;
    const total = e.detail.numFeaturesTotal;
    let message;
    if (subtotal === total){
      message = `Showing All ${total} Tracts`
    } else if (subtotal < total) {
      message = `Showing ${subtotal} of ${total} Tracts`
    }
    this.setState({
      featureCountMessage: message
    });
  }

  spinAddFilterButton(dir){
    let incrementNum
    if (dir === 'right'){
      incrementNum = 90;
    } else if (dir === 'left') {
      incrementNum = -90;
    }
    // ROTATE THE ADD FILTER BUTTON  
    const currentRotationCSS = this.refs.faPlusRotator.style.transform;
    if (currentRotationCSS === ''){
      this.refs.faPlusRotator.style.transform = 'rotateZ(90deg)'
    } else {
      const currentRotation = parseInt(currentRotationCSS.split('(')[1].slice(0,-1));
      this.refs.faPlusRotator.style.transform = `rotateZ(${currentRotation + incrementNum}deg)`;
    }
  }

  render() {
    return (
      <div className="filtersSection section">
        <div className='header'>
          <span className='header-title'>
            Filters<span className='fa fa-filter'/>
            <span className='featureCountMessage'>({this.state.featureCountMessage})</span>
            <div className={'addFilterButton addFilterButton-' + (this.state.filterIds.length < 3 ? 'active' : 'inactive')} onClick={this.handleAddFilter}>
              <div className='faPlusRotator' ref='faPlusRotator'>
                <span className='fa fa-plus'/>
              </div>
            </div>
          </span>
        </div>
        <div className='filtersContainer'>
          {this.renderFilterNodes(this.state.filterIds)}
          {this.state.filterIds.length === 0
            ? <div className='noFiltersMessage-container'><span className='noFiltersMessage'>No Filters Active</span></div>
            : null
          }
        </div>
      </div>
    );
  }

  renderFilterNodes(filterIds){
    const filterNodes = filterIds.map((filterId, i) => {
      var fields = [...this.fields];
      // eventually once debugging is completed, renderOrder should be used to be the placeholder for the filter titles
      const renderOrder = i + 1;
      // this filters out any fields which are already selected by other filters so users are not able to select fields twice
      if (filterIds.length > 1) {
        Object.keys(memory.filterSettings).forEach(settingKey => {
          if (filterId !== settingKey) {
            const field = memory.filterSettings[settingKey].fieldValue;
            console.log(field);
            fields.splice(fields.indexOf(field), 1);
          }
        });
      }
      return(
        <Filter key={filterId} id={filterId} memory={memory.filterSettings[filterId]} fields={fields} handleRemoveFilter={this.handleRemoveFilter} updateFilterSettingsMemory={this.updateFilterSettingsMemory} renderOrder={renderOrder} propsMd={this.props.propsMd} />
      )
    });
    return filterNodes;
  }
}

 export default FiltersSection;

 //data-tip='Add A Filter' data-for='addFilterTooltip'
 //<ReactTooltip id='addFilterTooltip' type='dark' place='right' effect='solid' className='addFilterTooltip' offset="{'right': 5}"/>
