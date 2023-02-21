import { useState } from 'react'


function Emergency(props) {
//  console.log(props.emergencyNum.Police)

// function test() {
//     for (const key in props.emergencyNum) {

//     console.log(`${key}: ${props.emergencyNum[key]}`);
//     return ( 
//                 <h1>key</h1>
//     )
// }

// }
// const test = () => {
//     return props.emergencyNum.map(() => {
//         return <p className={` ${props.emergencyType.toLowerCase()} emergency`}>{props.emergencyType}: {props.emergencyNum ? props.emergencyNum[props.emergencyType] : "n/a" }</p> 

//     })
// }

  return (
    <div className='emergency-container'>
    <p className={` ${props.emergencyType.toLowerCase()} emergency`}><span className='emergency-type-span'>{props.emergencyType}</span>: {props.emergencyNum ? props.emergencyNum[props.emergencyType] : "n/a" }</p> 
    </div>

  
  
  )
}

export default Emergency
