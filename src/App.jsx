import React, { useState, useEffect } from "react";
import Temperature from "./components/Temperature";
import Highlight from "./components/Highlights";

function App() {
  const [city, setCity] = useState("New Delhi");
  const [weatherData, setWeatherData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {

    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=b47995a6476b65732a943427e44d64df#`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Could not get data");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setWeatherData(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [city]);

  const convertKelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(2);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, []);

  if (!weatherData) {
    return <p>Loading...</p>;
  }
  const formatUnixTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString(); // Returns date and time
  };

  const getWindDirection = (deg) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5);
    return directions[index % 16];
  };



  return (
    <div className="bg-[#1F213A] h-screen flex justify-center align-top">
      <div className="flex justify-center mt-8 "><h1 className='text-slate-200 text-4xl font-bold '>Weather Data Forcast</h1></div>

      <div className="mt-40 w-1/5 h-1/3">
        {weatherData && (
          <Temperature
            setCity={setCity}
            stats={{
              temp: convertKelvinToCelsius(weatherData.main.temp),
              condition: weatherData.weather[0].description,
              isDay:
                weatherData.sys.sunrise < weatherData.dt &&
                weatherData.dt < weatherData.sys.sunset, // Example logic for day/night
              location: weatherData.name,
              // time: `${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}`, // Convert Unix time to human-readable format
              // time:formatUnixTime(weatherData.sys.sunrise),
              currentTime: currentTime.toLocaleString("en-IN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
            }}
          />
        )}
      </div>

      <div className=" mt-40 w-1/3 h-1/3 p-10 grid grid-cols-2 gap-6">
        <h2 className=" text-slate-200 text-2xl  col-span-2">
          Today's Highlight
        </h2>
        {weatherData && (
          <>
            <Highlight
              stats={{
                title: "Wind Status",
                value: weatherData.wind.speed,
                units: "mph",
                direction: getWindDirection(weatherData.wind.deg),
              }}
            />
            <Highlight
              stats={{
                title: "Humidity",
                value: weatherData.main.humidity,
                units: "%",
              }}
            />
            <Highlight
              stats={{
                title: "Visibility",
                value: ((weatherData.visibility)/1609.34).toFixed(2),
                units: "miles",
              }}
            />
            <Highlight
              stats={{
                title: "Air Pressure",
                value: weatherData.main.pressure,
                units: "mb",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
