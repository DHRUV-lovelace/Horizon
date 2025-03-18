import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { TextInput, View, StyleSheet, PermissionsAndroid, Platform, TouchableOpacity, Image, Text, ScrollView, RefreshControl, useWindowDimensions, Dimensions } from "react-native";
import GetLocation from 'react-native-get-location';
import WeatherSlide from "./WeatherSlides";

export type WeatherData = {
  id: string,
  icon: string,
  latitude: number,
  longitude: number,
  description: string,
  temp: string,
  pressure: string,
  humidity: string,
  wind: string,
}

const Home = () => {

  const API_KEY = "944e56c6401479371c1e394a4f0a1ecd";

  const navigation = useNavigation<any>();

  const [weatherdescription, setWeatherDescription] = useState("_ _");
  const [temp, setTemp] = useState("_ _");
  const [pressure, setPressure] = useState("_ _");
  const [humidity, setHumidity] = useState("_ _");
  const [wind, setWind] = useState("_ _");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [text, setText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [backgroundcolor, setBackgroundColor] = useState("#87CEEB");
  const [weatherData, setWeatherData] = useState<WeatherData[]>([
    {
      id: "current1",
      icon: "01d",
      latitude: 0,
      longitude: 0,
      description: "_ _",
      temp: "_ _",
      pressure: "_ _",
      humidity: "_ _",
      wind:"_ _"
    },
  ]);
  console.log("dhruv",weatherData);

  useEffect(() => {requestLocationPermission();}, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Location permission granted");
          getCurrentLocation()

        } else {
          console.log("Location permission denied");
        }
      } catch (error) {
        console.warn(error);
      }
    }
    else{
      getCurrentLocation()
    }
  };

  const getCurrentLocation = async () => {
      console.log("getlocation");
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 6000
      });
  
      console.log("temp", location);
      if (location) {
        console.log('fetch');
        setLongitude(location.latitude);
        setLatitude(location.longitude);
        fetchWeatherData("current", location.latitude, location.longitude);
      }
    };

    const createWeatherObject = (data: any, name: string, latitude: number, longitude: number) => {
      return {
        id: `${name}`,
        icon: (data.weather[0].icon).toString(),
        latitude: latitude,
        longitude: longitude,
        description: (data.weather[0].main).toString(),
        temp: (data.main.temp - 273.15).toFixed(1),
        pressure: (data.main.pressure).toString(),
        humidity: (data.main.humidity).toString(),
        wind: (data.wind.speed).toString(),
      };
    };
  
    // Function to fetch weather data from API
    const fetchWeatherData = async (city:string, latitude: number, longitude: number) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
  
      try {
        console.log('fetching');
        const response = await fetch(url);
        const data = await response.json();
        // // Extract and set data
        // image = data.weather[0].icon.toString();
        // console.log("Image key:", image);
        // setWeatherDescription(data.weather[0].main);
        // const tempCelsius = (data.main.temp - 273.15).toFixed(1);
        // setTemp(tempCelsius);
        // setPressure(data.main.pressure.toString());
        // setHumidity(data.main.humidity.toString());
        // setWind(data.wind.speed.toString());
        // console.log('data set');
        console.log(createWeatherObject(data, city, latitude, longitude), "createobject")
        updateWeatherData(createWeatherObject(data, city, latitude, longitude))
      }
      catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    const updateWeatherData = (data: WeatherData) => {
      setWeatherData((prevData) =>
        prevData && prevData.some((item) => item.id === data.id) ? prevData.map((item) => (item.id === data.id ? data : item)) : [...prevData, data]
      );
      console.log(weatherData, "afterupdate")
    };
  
    const fetchCityData = async (city: string) => {
      const limit = 1;
      const city_url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${API_KEY}`;
  
      try {
        const response = await fetch(city_url);
        const data = await response.json();
        console.log(data);

        if (data.length > 0) {
          const lat = data[0].lat;
          const lon = data[0].lon;
          setLatitude(data[0].lat);
          setLongitude(data[0].lon);

          fetchWeatherData(city, lat, lon);
        }
      }
      catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

  const onRefresh = () => {

    setRefreshing(true);
    fetchWeatherData("current", latitude, longitude).finally(() => setRefreshing(false));

  };

  const handleSearch = () => {
    console.log("clicked")
    if (text.trim().length > 0) {
      console.log("searching");
      fetchCityData(text);
      setText("")
    };
  };

  const onPressProfile = async() =>{
    return navigation.navigate('profile');
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 ,justifyContent: "center", alignItems: "center"}} 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

      {/* main conatiner containing all other containers*/} 
      <View style={[styles.container, {backgroundColor: `${backgroundcolor}`}]}> 

        <View style={styles.containercolumn}>

          {/* conains the profile image and search bar */}
          <View style={styles.containerrow}>

            {/* profile button */}
            <TouchableOpacity style={styles.profilebutton} onPress={()=> onPressProfile()}>
              <Image source={require('../assets/images/profile.png')} style={styles.profileimage}/>
            </TouchableOpacity>

            {/* search bar */}
            <TextInput
              placeholder="Enter any Location"
              placeholderTextColor='black'
              style={styles.search}
              value={text}
              onChangeText={(text) => setText(text)}
              onSubmitEditing={() => handleSearch()}
              returnKeyType="search"/>

          </View>

          <View style={{width: Dimensions.get("screen").width}}>
            <WeatherSlide weatherData={weatherData} setBackground={setBackgroundColor}/>
          </View>

        </View>

      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({

    container: {
      flex: 1,
    },
    containerrow: {
      flexDirection: "row"
    },
    containercolumn: {
      flexDirection: "column",
      marginTop: 22
    },

    search: {
      width: '84%',
      height: 50,
      backgroundColor: 'white',
      borderRadius: 25,
      paddingHorizontal: 27,
      fontSize: 16,
      marginStart: 10,
      marginTop: 20,
      marginEnd: 3,
      borderWidth: 2
    },
    profilebutton: {
      height: 50,
      width: 50,
      backgroundColor: 'black',
      marginTop: 20,
      marginStart: 5,
      borderRadius: 25,
    },
    profileimage: {
      width: 50,
      height: 50,
      borderWidth: 2,
      borderRadius: 25
    },
    carousel: {
      
    }
});

export default Home;