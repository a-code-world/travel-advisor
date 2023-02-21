import { useState, useEffect, useRef } from 'react'
import './App.css'
import axios from 'axios'
import countryData from '../data/countryData'
import embassies from '../data/embassies'
import Emergency from './Components/Emergency'


function App() {

  const [countryCode, setCountryCode] = useState("")
  const [advisoryMessage, setAdvisoryMessage] = useState("")
  const [emergencyNum, setEmergencyNum] = useState({})
  const [searchSubmitted, setSearchSubmitted] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [embassyData, setEmbassyData] = useState("")
  const [isEmbassyAvailable, setIsEmbassyAvailable]  = useState(false)
  const inputRef = useRef(false);
  const memberOf112Ref = useRef();
  const name = useRef("United States of America");
  
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    travelData()
  }, []);


  

function handleChange (e) {
  name.current = e.target.value;
}

function getEmbassyData() {

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
          setAdvisoryMessage(response.data.data[countryCode].advisory.message)

          if(e.Member_112) {
            memberOf112Ref.current = true;
            setEmergencyNum(
              { Police: e.Police.All[0], 
                Fire: e.Fire.All[0], 
                Ambulance: e.Ambulance.All[0],
                "Emergency": e.Member_112 ? "112" : null,
                
              })
            } else {
              memberOf112Ref.current = false;

              setEmergencyNum(
                { Police: e.Police.All[0], 
                  Fire: e.Fire.All[0], 
                  Ambulance: e.Ambulance.All[0],
                })
            }
            
          setSearchSubmitted(true)
          getEmbassyData()
        
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

      <div className='header'>
        <div className="logo-container">
          <img className='logo-img' src="/logo.png" alt="travel advisor logo" />
          <p className='logo-text'><span className='logo-text-span'>Travel</span>Advisor</p>
        </div>
        <div className='search-container'>
          <input onKeyDown={handleKeyDown} id='input' ref={inputRef}  className='input' placeholder='Enter country...' type="text" spellcheck="false" onChange={handleChange} onSubmit={travelData}/>
          <img className='search-icon' onClick={travelData} src="/search.png" alt="magnifying glass search icon" />
        </div>
      </div>

      <div className='country-container'>
        {searchSubmitted ? <img className='flag' src={`https://flagsapi.com/${countryCode}/shiny/64.png`} alt={`flag of ${name.current}`}/> : null }
        {searchSubmitted ? <h1 className='country-name-text'>{name.current.toUpperCase()}</h1> : null }
      </div>

      <div className='advisory-container' onClick={getEmbassyData}>
        <p className='advisory-msg'>{advisoryMessage}</p>
      </div>

      <div className="tabs-container">
          <div className={tabIndex === 0 ? 'tabs active-tab' : 'tabs'}onClick={() => handleTab(0)}>
            <p className='tab-name'>EMERGENCY # 's</p>
          </div>

          <div className={tabIndex === 1 ? 'tabs active-tab' : 'tabs'} onClick={() => handleTab(1)}>
            <p className='tab-name'>EMBASSY</p>
          </div>
      </div>

      <div className={tabIndex === 0 ? 'numbers-container active-content numbers' : 'numbers-container content'}>
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
         {memberOf112Ref.current ? <Emergency 
              emergencyNum = {emergencyNum}
              emergencyType = "Emergency"
            /> : null} 
      {/* {searchSubmitted ? <p className='police emergency'>Police: {emergencyNum ? emergencyNum.Police : "n/a" }</p> : null } */}
      </div>

      <div className={tabIndex === 1 ? 'active-content embassy-container' : 'content'}>
            {isEmbassyAvailable ? 
              <div>
              <img className='pin-img' src="/pin.png" alt="" />
              <h1 className='embassy-title'><span className='embassy-text-span '>United States Embassy in</span> {embassyData.Name}</h1>
              <p><span className='embassy-text-span'>Address:</span> {embassyData.Address}</p>
              <p><span className='embassy-text-span'>Phone:</span> {embassyData.Phone}</p>
              <p><span className='embassy-text-span'>Website:</span> <a href={embassyData.Website}>{embassyData.Website}</a></p>
              </div> 
              : <p className='no-embassy'>No Embassy Available</p>
            }
      </div>

    </div>


  )
}

export default App
