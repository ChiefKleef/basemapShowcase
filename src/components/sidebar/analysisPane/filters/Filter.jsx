import './Filter.styl';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import ActiveSlider from '../commonComponents/ActiveSlider.jsx';
import Select from 'react-select';
import 'rc-slider/assets/index.css';
const Slider = require('rc-slider');
const Range = Slider.Range;

import { validateRange } from './filterValidators.jsx'

function dollarFormatter(v) {
  return '$' + v;
}

class Filter extends React.Component {
  constructor(props){
    super();
    const defaultRange = [
          props.propsMd[props.fields[0].value].range.min,
          props.propsMd[props.fields[0].value].range.max
      ]
    const defaultFilterSetting = {
      titleValue: '',
      filterActive: true,
      fieldValue: props.fields[0].value,
      filterValid: false,
      range: defaultRange,
      selectedRange: defaultRange,
      units: props.propsMd[props.fields[0].value].units
    }
    if (props.memory === undefined){
      this.state = defaultFilterSetting;
      // potentially going to be using this to allow an editing session of the value
      this.state.rangeMinInputActive = false;
      this.state.rangeMaxInputActive = false;
      // range input value state used to set the value of the input during an editing session
      // -- before and after editing, the value of the input is determined by the sliders
      this.state.rangeInputValue = '';
    } else {
      this.state = props.memory;  
    }
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleFilterActiveToggle = this.handleFilterActiveToggle.bind(this);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
    this.handleFieldSelection = this.handleFieldSelection.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleSliderAfterChange = this.handleSliderAfterChange.bind(this);
    this.handleRangeInputFocus = this.handleRangeInputFocus.bind(this);
    this.handleRangeInputChange = this.handleRangeInputChange.bind(this);
  }

  componentDidMount(){
    this.props.updateFilterSettingsMemory(this.props.id, this.state);
  }

  componentDidUpdate(){
    console.log('NEW FILTER STATE: ');
    console.log(this.state);
    this.props.updateFilterSettingsMemory(this.props.id, this.state);
  }

  handleTitleChange(e){
    const title = e.target.value
    this.setState({
      titleValue: title
    });
  }

  handleFilterActiveToggle(ref){
    this.setState({
      filterActive: !this.state.filterActive
    });
  }

  handleFieldSelection(val){
    this.setState({
      fieldValue: val
    });
  }

  handleRemoveFilter(e){
    // SCRAPE FILTER ID FROM REMOVE FILTER BUTTON ID
    const filterId = e.target.id.slice(e.target.id.indexOf('-') + 1);
    console.log(filterId);
    this.props.handleRemoveFilter(filterId);
  }

  handleSliderChange(selectedRange){
    this.setState({
      selectedRange: selectedRange
    });
  }

  handleSliderAfterChange(selectedRange){
    this.setState({
      selectedRange: selectedRange,
      filterValid: validateRange(this.state.range, selectedRange)
    });
  }

  handleRangeInputFocus(e){
    const className = e.target.className;
    if (className.indexOf('rangeInput-min') > -1){
      this.setState({
        rangeInputValue: this.state.selectedRange[0],
        rangeMinInputActive: true
      });
    } else if (className.indexOf('rangeInput-max') > -1){
      this.setState({
        rangeInputValue: this.state.selectedRange[1],
        rangeMaxInputActive: true
      });
    }
    //on blur sync back up and perform validation...
  }

  handleRangeInputBlur(e){
    const className = e.target.className;
    if (className.indexOf('rangeInput-min') > -1){
      var selectedRange = this.state.selectedRange;
      selectedRange[0] = this.state.rangeInputValue;
      this.setState({
        selectedRange: selectedRange,
        rangeMinInputActive: false
      });
    } else if (className.indexOf('rangeInput-max') > -1){
      var selectedRange = this.state.selectedRange;
      selectedRange[1] = this.state.rangeInputValue;
      this.setState({
        selectedRange: selectedRange,
        rangeMaxInputActive: false
      });
    }
  }

  handleRangeInputChange(e){
    this.setState({
      rangeInputValue: e.target.value
    });
  } 

  render() {
    console.log('RANGE:', this.state.range);
    return (
      <div className="filter" ref={'filter-' + this.props.id} id={this.props.id}>
        <div className='titleAndControls filterSection'>
          <input type='text' className='titleInput' value={this.state.titleValue} onChange={this.handleTitleChange} placeholder={'Filter Title ' + this.props.id} />
          <div className='removeFilterButton'>
            <span className='fa fa-trash' id={'rfb-' + this.props.id} onClick={this.handleRemoveFilter} />
          </div>
          <ActiveSlider active={this.state.filterActive} handleFilterActiveToggle={this.handleFilterActiveToggle} />
        </div>
        <div className='fieldSelector filterSection'>
          <span className='filterSection-title'>Field:</span>
          <Select
            className='select-field select'
            name="Select Field"
            value={this.state.fieldValue}
            options={this.props.fields}
            onChange={this.handleFieldSelection}
            clearable={false}
          />
        </div>
        <div className='rangeSelector filterSection'>
          <span className='filterSection-title'>Range:</span>
          <div className='sliderContainer'>
            <div className='rangeInputContainer'>
              <div className='rangeInputSubCont-min rangeInputSubCont'>
                <input className='rangeInput-min rangeInput' type="text" 
                       value={this.state.rangeMinInputActive ? this.state.rangeInputValue : this.state.selectedRange[0]} 
                       onFocus={this.handleRangeInputFocus} 
                       onChange={this.handleRangeInputChange}/>
                <span className='rangeInputLabel rangeInputLabel-min'>min</span>
              </div>
              <div className='rangeInputSubCont-max rangeInputSubCont'>
                <span className='rangeInputLabel rangeInputLabel-max'>max</span>
                <input className='rangeInput-max rangeInput' type="text" 
                       value={this.state.rangeMaxInputActive ? this.state.rangeInputValue : this.state.selectedRange[1]} 
                       onFocus={this.handleRangeInputFocus} 
                       onChange={this.handleRangeInputChange}/>
              </div>
            </div>
            <Range className='slider' defaultValue={this.state.selectedRange} min={this.state.range[0]} max={this.state.range[1]} onChange={this.handleSliderChange} onAfterChange={this.handleSliderAfterChange} tipFormatter={dollarFormatter} />
          </div>
        </div>
        <div className={'validationBar validationBar-' + (this.state.filterValid && this.state.filterActive)} />
      </div>
    );
  }
}
 export default Filter;
