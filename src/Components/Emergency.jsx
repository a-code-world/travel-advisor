import { useState } from 'react'


function Emergency(props) {

  return (
    <div className='emergency-container'>
    <p className={` ${props.emergencyType.toLowerCase()} emergency-num`}>
      <span className='emergency-type-span'>{props.emergencyType}:</span>
      {props.emergencyNum ? <span className='num-span'> {props.emergencyNum[props.emergencyType]}</span>  : "n/a" }
    </p> 
    </div>
  )
}

export default Emergency
