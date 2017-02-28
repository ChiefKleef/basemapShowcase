import React from 'react';
import './LegendEntry.styl'

function LegendEntry(props) {
  let entryTitle
  if (props.range === 'null values and non-numbers'){
    entryTitle = props.range.split(' ').slice(0,2).join(' ');
  } else if (props.min === null && props.max === null){
    entryTitle = props.description;
  } else {
    entryTitle = `${props.min} to ${props.max}`
  }
  var colorSquareStyle = {
    backgroundColor: `${props.color}`
  }
  if (entryTitle === 'Does Not Meet Filter Criteria'){
    colorSquareStyle.opacity = '0.3';
  }
  return (
    <div className='legendEntry'>
      <div className='legendEntry-colorSquare' style={colorSquareStyle}>
        <div className='legendEntry-colorSquare-inner' style={colorSquareStyle}/>
        <div className='legendEntry-colorSquare-innerBacksplash' />
      </div>
      <span className='legendEntry-title'>{entryTitle}</span>
    </div>
  );
}

export default LegendEntry;