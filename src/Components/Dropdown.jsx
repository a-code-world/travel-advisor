import { useState, useRef, useEffect } from 'react'
import Select from 'react-select'
import countryData from '../data/countryData';




function Dropdown(props) {
  const data = useRef();
  const selectRef = useRef(false)
  
  const customStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      // borderColor: state.isFocused ? 'grey' : 'red',
      borderRadius: '10px',
      width: `200px`,
      borderStyle: `none`,
      boxShadow: 'none'
      
      
    }),
    placeholder: (baseStyles, state) => ({
      ...baseStyles,
      color: `grey`,
    }),
    indicatorSeparator: () => {},
  }



  

  useEffect(() => {
      let temp = []
    countryData.map((item) => {
        temp.push({
          value: item.Country.Name,
          label: item.Country.Name,
        })
    })

    data.current = temp;
  },[]);


  return (

    <Select 
          onChange={(choice) => props.handleChange(choice)}
          options={data.current} 
          styles={customStyles}
        />
    )
    
}

export default Dropdown
