import { combineReducers } from "redux"
import Location from "./slices/fetchLocationSlice";
import currentWeather from "./slices/currentWeatherSlice";
import forecastWeather from "./slices/forecastWeatherSlice";
import Login from "./slices/loginUserSlice";
import AuthUser from "./slices/authUserSlice";

const combinedReducers = combineReducers({
    location: Location,
    weather: currentWeather,
    forecast: forecastWeather,
    login: Login,
    Auth: AuthUser
})

export default combinedReducers;