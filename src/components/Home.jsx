import { useEffect, useState } from "react";
import Section from "./Section.jsx";
import { BsSearch } from "react-icons/bs";
import Loader from "./Loader.jsx";

const Home = () => {
  const api_key = "1baf41538ffb1d7b4b5560b86ccc414b";
  const [city, setCity] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [data, setData] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const history_data = JSON.parse(localStorage.getItem("history"));
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    fetchWeather();
  }, [city, countryCode]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const country_code_value = document.getElementById("country_code").value;
    const city_value = document.getElementById("city").value;
    setCountryCode(country_code_value);
    setCity(city_value);
  };

  const clearFormValue = () => {
    const clear_country_code = (document.getElementById("country_code").value =
      "");
    const clear_city = (document.getElementById("city").value = "");
    setCountryCode(clear_country_code);
    setCity(clear_city);
  };

  const fetchWeather = async () => {
    setLoading(true);
    const api = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${api_key}`
    );
    const response = await api.json();
    console.log(response);
    setData(response);

    console.log(response.timezone);
    const date = new Date();
    const days = { weekday: "long" };
    const dayOfWeek = date.toLocaleString("en-US", days);

    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
    const timeOffset = response.timezone / 3600;
    const target_time = new Date(utcTime + 3600000 * timeOffset);
    const am_pm_time = target_time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    setDayOfWeek(dayOfWeek);
    setTime(am_pm_time);
    setLoading(false);

    if (response.cod == 200) {
      if (city != "" || countryCode != "") {
        var history_obj = {
          city_key: response.name,
          country_code_key: response.sys?.country,
          date_time_key: dayOfWeek + " " + am_pm_time,
          weather_icon_key: response.weather && response.weather[0].icon,
          weather_desc_key: response.weather && response.weather[0].description,
          temp_key: response.main?.temp,
          humidity_key: response.main?.humidity,
          pressure_key: response.main?.pressure,
          wind_speed_key: response.wind?.speed,
        };

        if (history_data) {
          history_data.push(history_obj);
          localStorage.setItem(
            "history",
            JSON.stringify(history_data.slice(-3))
          );
        } else {
          localStorage.setItem("history", JSON.stringify([history_obj]));
        }
      }
    }
    // setHistoryList(history_data?.slice(-3));
    setHistoryList(JSON.parse(localStorage.getItem("history"))?.slice(-3));
  };

  console.log("test ");
  console.log(JSON.parse(localStorage.getItem("history")));
  console.log(historyList);

  return (
    <div className="weather-wrapper bg-blue-200 min-h-[100vh]">
      <Section>
        <h1 className="text-3xl md:text-4xl text-center mb-10 font-medium">
          Search Current Weather
        </h1>
        <div className="my-10 max-w-[800px] mx-auto">
          <form
            onSubmit={onSubmitHandler}
            className="flex md:items-center justify-center flex-col md:flex-row"
          >
            <input
              type="text"
              name="country_code"
              id="country_code"
              placeholder="Enter country code"
              className="rounded text-black outline-0 h-[45px] px-3 w-[100%] mr-3 mb-3 md:mb-0 leading-[45px] outline-none"
            />
            <input
              type="text"
              name="city"
              id="city"
              placeholder="Enter a city name"
              className="rounded text-black outline-0 h-[45px] px-3 w-[100%] mr-3 mb-3 md:mb-0 leading-[45px] outline-none"
            />
            <button
              onClick={onSubmitHandler}
              className="flex items-center justify-center min-w-[120px] bg-blue-600 hover:bg-blue-500 text-white font-light rounded h-[45px] px-3 cursor-pointer "
            >
              <BsSearch className="text-xl mr-2" /> Search
            </button>
          </form>
          {(city || countryCode) && (
            <div className="text-right">
              <button
                onClick={() => clearFormValue()}
                className="mt-5 hover:text-zinc-600 underline"
              >
                Clear
              </button>
            </div>
          )}
          <div className="text-xl bg-white rounded px-5 py-10 md:p-10 mt-5">
            {loading ? (
              <Loader />
            ) : (
              <>
                {data.name ? (
                  <>
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-[50%]">
                        <p className="text-3xl mb-2">
                          <b>
                            {data.name}, {data.sys?.country}
                          </b>
                        </p>
                        <p className="text-gray-500">
                          {dayOfWeek} {time}
                        </p>
                        <div className="mt-5">
                          {data.weather && (
                            <img
                              src={`https://openweathermap.org/img/wn/${
                                data.weather && data.weather[0].icon
                              }@4x.png`}
                              className="mx-[-30px] mt-[-40px] mb-[-40px]"
                            />
                          )}
                          <p className="capitalize">
                            {data.weather && data.weather[0].description}
                          </p>
                        </div>
                      </div>

                      <div className="w-full md:w-[50%] mt-10 md:mt-0">
                        <div className="mb-2">
                          <span className="text-gray-500">Temperature:</span>
                          &nbsp;
                          {(data.main?.temp - 273.15).toFixed(1)}°C ,&nbsp;
                          {(((data.main?.temp - 273.15) * 9) / 5 + 32).toFixed(
                            1
                          )}
                          °F
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-500">Humidity:</span>&nbsp;
                          {data.main?.humidity}%
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-500">Pressure:</span>&nbsp;
                          {data.main?.pressure} hPa
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-500">Wind:</span>&nbsp;
                          {(data.wind?.speed * 3.6).toFixed(1)} km/h
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center text-zinc-500">
                      {data.cod == 400 ? (
                        <>
                          Please enter country code or city name to view the
                          current weather.
                        </>
                      ) : (
                        <>
                          <span className="custom-first-letter-cap">
                            {/* {data.message}! */}
                          </span>{" "}
                          Please enter correct country code or city name.
                        </>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <div className="mt-10">
            <h3 className="text-2xl font-bold">Latest Search History</h3>
            <div>
              {historyList ? (
                historyList
                  ?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        id={`item_${index}`}
                        className="text-base bg-white/60 rounded px-5 py-5 md:p-5 mt-5 flex"
                      >
                        <div className="w-full md:w-[50%]">
                          <p className="text-xl mb-2">
                            <b>
                              {item?.city_key}, {item?.country_code_key}
                            </b>
                          </p>
                          <p className="text-base text-gray-500">
                            {item?.date_time_key}
                          </p>
                          <div className="mt-5">
                            <img
                              src={`https://openweathermap.org/img/wn/${item?.weather_icon_key}@4x.png`}
                              className="mx-[-20px] mt-[-40px] mb-[-30px] w-[150px]"
                            />
                            <p className="capitalize">
                              {item?.weather_desc_key}
                            </p>
                          </div>
                        </div>
                        <div className="w-full md:w-[50%]">
                          <div className="mb-2">
                            <span className="text-gray-500">Temperature:</span>
                            {(item?.temp_key - 273.15).toFixed(1)}°C ,&nbsp;
                            {(((item?.temp_key - 273.15) * 9) / 5 + 32).toFixed(
                              1
                            )}
                            °F
                          </div>
                          <div className="mb-2">
                            <span className="text-gray-500">Humidity:</span>
                            &nbsp;{item?.humidity_key}%
                          </div>
                          <div className="mb-2">
                            <span className="text-gray-500">Pressure:</span>
                            &nbsp;{item?.pressure_key} hPa
                          </div>
                          <div className="mb-2">
                            <span className="text-gray-500">Wind:</span>
                            &nbsp; {(item?.wind_speed_key * 3.6).toFixed(
                              1
                            )}{" "}
                            km/h km/h
                          </div>
                        </div>
                      </div>
                    );
                  })
                  .reverse()
              ) : (
                <p className="mt-5">No search history yet.</p>
              )}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Home;
