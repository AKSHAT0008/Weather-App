import searchIcon from './assets/searchIcon.png'
import sun from './assets/sun.png'
import rainy from './assets/rainy-day.png'
import drizzle from './assets/drizzle.png'
import humidity from './assets/humidity.png'
import cloudy from './assets/cloudy-day.png'
import snow from './assets/snowflake.png'
import wind from './assets/wind.png'
import axios from 'axios'
import searchI from './assets/search.png'
import { useEffect } from 'react'
import { useState } from 'react'

import Autosuggest from 'react-autosuggest'
function Weather(){
   const [WeatherData,setWeatherData] = useState({})
   const [imgURL,setimgURL] =useState(cloudy);
   const [city,setCity] = useState("")
   const [suggestion,setSuggestion] = useState([])
//    function capitalizeFirstLetter(string) {
//     if (!string) return string; 
//     return string.charAt(0).toUpperCase() + string.slice(1);
//   } 
const search = async (city) =>{
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=9d93359fc5f88b14074e7d58adeebd22`
        const responce = await axios.get(url)
        const data =  responce.data
        console.log(data);
        setWeatherData(
            {
                humidity:data.main.humidity,
                temp: Math.floor( data.main.temp),
                name:data.name,
                wind: data.wind.speed,
                code:data.weather[0].icon,
                description:data.weather[0].description
            })
        
        setimgURL(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
        console.log(imgURL);
        console.log(WeatherData);
    } catch (error) {
        console.log("error");
    }
}
const fetchSuggestion = async ({value}) =>{
    
    if (value && value.trim().length > 0) {
    try {
        const url =`https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=6&appid=9d93359fc5f88b14074e7d58adeebd22`
        const res = await axios.get(url);
        const data = res.data;
        console.log(data);
        setSuggestion(data.map((item)=>({name:item.name})));
        console.log(suggestion);

    }  
    catch (error) {
        console.log("error fetch " + error)
    }
}
else {
    setSuggestion([]);
  }}
    useEffect(()=>{
        search("New York")
        fetchSuggestion("london")
    },[])
 const renderSuggestion=(suggestion)=>(
        <>
        <div className="suggestion-container" onClick={()=>{
            // setCity(suggestion.name) 
            search(suggestion.name) 
            setTimeout(() => setCity(""), 0)   
            }}>
        <img className='searchIcon-suggestion' src={searchI} alt="" />
        <div className='name-suggestion'  >  {suggestion.name}</div>
        </div>
        </>
    )
    return(
        <>
        <div className="weather">
        <div className="searchContainer">
            {/* <input  className='searchBar' type="search" 
            value={city}
            onChange={(e) => {
                setCity(e.target.value)
            }} 
            onKeyDown={
                (e)=>{
                    if(e.key==='Enter'){
                      search(city)
                      setCity(()=>"")
                    }
                }
            }
            placeholder="Search city..." /> */}
            <Autosuggest 
            suggestions={suggestion}
            onSuggestionsFetchRequested={fetchSuggestion}
            onSuggestionsClearRequested={()=>setSuggestion([])}
            getSuggestionValue={(suggestion)=>suggestion.name}
            renderSuggestion={renderSuggestion}
            
            inputProps={{
                placeholder:'Search city...',
                value:city,
                onChange: (e, { newValue }) => setCity(newValue),
                onKeyDown:
                    (e)=>{
                        if(e.key==='Enter'){
                          search(city)
                          setCity(()=>"")
                        }
                    }    
            }}
            />
            <img className='searchIcon' src={searchIcon} alt="noimg" onClick={()=>{
                search(city)
                setCity(()=>"")
            }}  />
        </div>
        <div className="temp-container">
        <img className="Tempicon" src={imgURL} alt="" />
        <div className="nameNtemp">
            <div className="cityName">{WeatherData.name}</div>
             <div className="temp">{WeatherData.temp}°C</div>
             <div className="description">{WeatherData.description}</div>
        </div>
        </div>
        <div className="weatherData">
            <div className="humidty-container">
                    <img className='icon' src={humidity} alt="" />
                    <div className="humidity-data">{WeatherData.humidity}%</div>

            </div>
            <div className="wind-container">
                <img className='icon' src={wind} alt="" />
                <div className="windSpeed">{WeatherData.wind} km/hr</div>

            </div>
        </div>
        </div>
        </>
    )
}
export default Weather