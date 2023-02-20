import { useState, useEffect, useRef } from 'react'
import './App.css'
import axios from 'axios'
import countryData from '../data/countryData'
import embassies from '../data/embassies'
import Emergency from '../Components/Emergency'




function App() {


  const [countryCode, setCountryCode] = useState("")
  const [advisory, setAdvisory] = useState("")
  const [emergencyNum, setEmergencyNum] = useState({})
  const [clicked, setClicked] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [embassyData, setEmbassyData] = useState("")
  const [isEmbassyAvailable, setIsEmbassyAvailable]  = useState(false)
  const [countrySubmitted, setCountrySubmitted] = useState(false)
  const [count, setCount] = useState(0)

  const inputRef = useRef();
  const name = useRef("United States of America");
  const hasEmbassy = useRef(false);


  
  
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  useEffect(() => {
    travelData()
  }, []);


  

function handleChange (e) {

  name.current = e.target.value;
  
    // setCountry(e.target.value)
}



function embassyInfo() {

let info = ""

  embassies.map(e => {
  
    if(e.Country.toLowerCase() === name.current.toLowerCase()) {
      const name = e.Country  
      const address = e.Address;
      const phone = e.Phone;
      const website = e.Website

      info = 
        {
          Name: e.Country,
          Address: e.Address,
          Phone: e.Phone,
          Website: e.Website
        }

    } else if (e.Country.toLowerCase() !== name.current.toLowerCase())  {
   
      null
    }
  })

  if (typeof info === "object") {
      setIsEmbassyAvailable(true)
      setEmbassyData(info)
    } else {
      setIsEmbassyAvailable(false)
    }

}




const travelData = () => {


  countryData.map(e => {
    
    if(e.Country.Name.toLowerCase() === name.current.toLowerCase() ) {

      const countryCode = e.Country.ISOCode;
      let emergencyNumbers = {};
     
      axios.get(`https://www.travel-advisory.info/api?countrycode=${countryCode}`)
      .then(response => {
        // console.log(eval(`${`response.data.data.` + countryCode}`))
          
          // eval statment used below works, but its evidently not safe to use eval(). I used it because I could
          //not figure out how to use the countryCode variable in the response path. Square bracket worked
          // setAdvisory(eval(`${`response.data.data.` + countryCode}`).advisory.message)
          setCountryCode(countryCode)
          setAdvisory(response.data.data[countryCode].advisory.message)

          if(e.Member_112) {
            setEmergencyNum(
              { Police: e.Police.All[0], 
                Fire: e.Fire.All[0], 
                Ambulance: e.Ambulance.All[0],
                Member_112: e.Member_112 ? "112" : null,
                
              })
            } else {
              setEmergencyNum(
                { Police: e.Police.All[0], 
                  Fire: e.Fire.All[0], 
                  Ambulance: e.Ambulance.All[0],

                  
                })
            }
            
          setClicked(true)
          embassyInfo()
        
          

      })
      
    }
  })
      
}




function handleTab(index){
  setTabIndex(index)
}

const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    travelData();
  }
};



  return (


    <div className='app-container'>

      <div className='input-container'>
        <input onKeyDown={handleKeyDown} id='input' ref={inputRef}  className='input' placeholder='Country...' type="text" spellcheck="false" onChange={handleChange} onSubmit={travelData}/>
        <button id='btn' onClick={travelData}>Search</button>

      </div>

      <div className='country-container'>
        {clicked ? <img className='flag' src={`https://flagsapi.com/${countryCode}/shiny/48.png`} alt={`flag of ${name.current}`}/> : null }

        {clicked ? <h1 className='country-text'>{name.current.toUpperCase()}</h1> : null }
      </div>



      <div className='advisory-container' onClick={embassyInfo}>
        <p className='advisory-msg'>{advisory}</p>
      </div>



      <div className="tabs-container">
          <div className={tabIndex === 0 ? 'home tabs active-tab' : 'home tabs'}onClick={() => handleTab(0)}>
            <p className='tab main-tab'>EMERGENCY #</p>
          </div>

          <div className={tabIndex === 1 ? 'embassy tabs active-tab' : 'embassy tabs'} onClick={() => handleTab(1)}>
            <p className='tab'>EMBASSY</p>
          </div>

      </div>

      <div className={tabIndex === 0 ? 'numbers-container active-content' : 'numbers-container content'}>
          <Emergency 
              emergencyNum = {emergencyNum}
              emergencyType = "Police"
            />
          <Emergency 
              emergencyNum = {emergencyNum}
              emergencyType = "Fire"
            />
          <Emergency 
              emergencyNum = {emergencyNum}
              emergencyType = "Ambulance"
            />
          {/* <Emergency 
              emergencyNum = {emergencyNum}
              emergencyType = "Member_112"
            /> */}
      {/* {clicked ? <p className='police emergency'>Police: {emergencyNum ? emergencyNum.Police : "n/a" }</p> : null } */}
      </div>

      <div className={tabIndex === 1 ? 'embassy-container active-content embassy-container' : 'content'}>
            {isEmbassyAvailable ? 
            <div>
            <img className='pin-img' src="..\assets\pin.png" alt="" />
            <h1 className='embassy-title'><span className='embassy-text-span '>United States Embassy in</span> {embassyData.Name}</h1>
            <p><span className='embassy-text-span'>Address:</span> {embassyData.Address}</p>
            <p><span className='embassy-text-span'>Phone:</span> {embassyData.Phone}</p>
            <p><span className='embassy-text-span'>Website:</span> <a href={embassyData.Website}>{embassyData.Website}</a></p>
            </div> 
              : <p>No Embassy Available</p>}
      </div>

    </div>


  


  )
}

export default App
