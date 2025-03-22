import "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useRef, useId } from "react";
import { Dimensions, Image, Modal, PermissionsAndroid, Platform, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import GetLocation from "react-native-get-location";
import WeatherSlide from "./WeatherSlides";
import RainEffect from "./rain";
import Suggestions from "./sugggestions";
import { FlatList } from "react-native-reanimated/lib/typescript/Animated";

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
  filter: string
};

type locationData = {
  name: string,
  temp: string
}

type backgroundColors = Record<string, string>;

const Home = () => {

  const API_KEY = "944e56c6401479371c1e394a4f0a1ecd";

  const navigation = useNavigation<any>();

  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [text, setText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [backgroundcolor, setBackgroundColor] = useState("#87CEEB");
  const weatherSliderRef = useRef<FlatList<any>>(null);
  const [visible, setVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Today");
  const show = () => setVisible(true)
  const hide = () => setVisible(false)
  const [weatherData, setWeatherData] = useState<WeatherData[]>([
    {
      id: "Current",
      icon: "01d",
      latitude: 0,
      longitude: 0,
      description: "_ _",
      temp: "_ _",
      pressure: "_ _",
      humidity: "_ _",
      wind: "_ _",
      filter: "Today"
    },
  ]);
  const [locationData, setLocationData] = useState<locationData[]>([
    {
      name: "Delhi",
      temp: "_ _",
    },
    {
      name: "Mumbai",
      temp: "_ _",
    },
    {
      name: "Kerala",
      temp: "_ _",
    },
    {
      name: "Haryana",
      temp: "_ _",
    },
    {
      name: "Karnataka",
      temp: "_ _",
    },
  ]);

  const backgroundColors: backgroundColors = {
    "01d": "#00ABFF",
    "02d": "#87CEFA",
    "03d": "#B0C4DE",
    "04d": "#d6e4ed",
    "09d": "#6c8094",
    "10d": "#f6f1d1",
    "11d": "#30639c",
    "13d": "#f5f7f8",
    "50d": "#bdbdbd",
    "01n": "#00ABFF",
    "02n": "#778899",
    "03n": "#708090",
    "04n": "#d6e4ed",
    "09n": "#6c8094",
    "10n": "#f6f1d1",
    "11n": "#30639c",
    "13n": "#f5f7f8",
    "50n": "#bdbdbd",
  };

  useEffect(() => { requestLocationPermission(); }, []);

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
    else {
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
      fetchWeatherData("Current", location.latitude, location.longitude, "Today");
    }
  };

  const createWeatherObject = (data: any, name: string, latitude: number, longitude: number, filter: string) => {
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
      filter: `${filter}`
    };
  };

  const findForcast = (data: object, filter: string) => {

    const tomorrow = 86400
    const day2 = 172800
    const day3 = 259200
    const now = new Date()
    const nowTimeStamp = Math.floor(now.getTime() / 1000)
    let index = -1

    if (Array.isArray(data)) {

      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        const timeToChoose = item.dt - nowTimeStamp

        if (filter === "Tomorrow") {
          if (timeToChoose >= tomorrow) {
            console.log(i, "tomorrow")
            index = i
            return index
          }
        }
        else if (filter === "Day 2") {
          if (timeToChoose >= day2) {
            console.log(i, "Day 2")
            index = i
            return index
          }
        }
        else {
          if (timeToChoose >= day3) {
            console.log(i, "Day 3")
            index = i
            return index
          }
        }
      }
    }
    return -1
  }

  const fetchWeatherData = async (city: string, latitude: number, longitude: number, filter: string, scroll?: boolean) => {

    const url_Today = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    const url_filter = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=${40}&appid=${API_KEY}`

    try {
      console.log('fetching');

      let response: Response;

      if (filter === "Today") {
        response = await fetch(url_Today);
      }
      else {
        response = await fetch(url_filter);
      }

      const data = await response.json();

      if (filter === "Today") {
        console.log(createWeatherObject(data, city, latitude, longitude, filter), "createobject", filter)
        updateWeatherData(createWeatherObject(data, city, latitude, longitude, filter), scroll)
        if (city === "Current") {
          const newBackground = backgroundColors[data.weather[0].icon]
          setBackgroundColor(newBackground)
        }
      }
      else if (filter === "Tomorrow") {

        const filteredData = data.list[findForcast(data.list, filter)]
        updateWeatherData(createWeatherObject(filteredData, city, latitude, longitude, filter), scroll)
        if (city === "Current") {
          const newBackground = backgroundColors[filteredData.weather[0].icon]
          setBackgroundColor(newBackground)
        }

      }
      else if (filter === "Day 2") {

        const filteredData = data.list[findForcast(data.list, filter)]
        updateWeatherData(createWeatherObject(filteredData, city, latitude, longitude, filter), scroll)
        if (city === "Current") {
          const newBackground = backgroundColors[filteredData.weather[0].icon]
          setBackgroundColor(newBackground)
        }

      }
      else if (filter === "Day 3") {

        const filteredData = data.list[findForcast(data.list, filter)]
        updateWeatherData(createWeatherObject(filteredData, city, latitude, longitude, filter), scroll)
        if (city === "Current") {
          const newBackground = backgroundColors[filteredData.weather[0].icon]
          setBackgroundColor(newBackground)
        }

      }
    }
    catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const updateWeatherData = (data: WeatherData, scroll?: boolean) => {
    setWeatherData((prevData) =>
      prevData && prevData.some((item) => item.id === data.id) ? prevData.map((item) => (item.id === data.id ? data : item)) : [...prevData, data]
    );

    const summarydata: locationData = {
      name: data.id,
      temp: data.temp
    };

    setLocationData((prevData) =>
      prevData && prevData.some((item) => item.name === summarydata.name) ? prevData.map((item) => (item.name === summarydata.name ? summarydata : item)) : [...prevData, summarydata]
    );
    if (scroll === true) {
      scrollTo(data.id)
    }
  };

  const scrollTo = (name: string) => {
    let index = weatherData.findIndex((item) => item.id === name)
    console.log(index, "index")
    if (index != -1) {
      weatherSliderRef.current?.scrollToIndex({ animated: true, index: index })
    }
  }

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

        fetchWeatherData(city, lat, lon, "Today", true);
      }
    }
    catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const onRefresh = async () => {

    setRefreshing(true);
    await Promise.all(
      weatherData.map(async (item) => {
        await fetchWeatherData(item.id, item.latitude, item.longitude, "Today");
      })
    ).finally(() => setRefreshing(false));

  };

  const handleSearch = () => {
    console.log("clicked")
    if (text.trim().length > 0) {
      console.log("searching");
      fetchCityData(text.trim());
      setText("")
    };
  };

  const onPressProfile = async () => {
    return navigation.navigate('profile');
  };

  const applyfilter = async (filter: string) => {
    if (filter === "Today") {
      setSelectedFilter(filter)
      hide()
      await Promise.all(
        weatherData.map(async (item) => {
          await fetchWeatherData(item.id, item.latitude, item.longitude, filter);
        })
      );
    }
    else if (filter === "Tomorrow") {
      setSelectedFilter(filter)
      hide()
      await Promise.all(
        weatherData.map(async (item) => {
          await fetchWeatherData(item.id, item.latitude, item.longitude, filter);
        })
      );
    }
    else if (filter === "Day 2") {
      setSelectedFilter(filter)
      hide()
      await Promise.all(
        weatherData.map(async (item) => {
          await fetchWeatherData(item.id, item.latitude, item.longitude, filter);
        })
      );
    }
    else if (filter === "Day 3") {
      setSelectedFilter(filter)
      hide()
      await Promise.all(
        weatherData.map(async (item) => {
          await fetchWeatherData(item.id, item.latitude, item.longitude, filter);
        })
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

      {/* main conatiner containing all other containers*/}
      <View style={[styles.container, { backgroundColor: `${backgroundcolor}` }]}>

        {/* <RainEffect element={<Text style={{ fontSize: 15 }}>🍆💦</Text>} count={10} speed={6000} angle={3}/> */}

        <View style={styles.containercolumn}>

          {/* conains the profile image and search bar */}
          <View style={styles.containerrow}>

            {/* profile button */}
            <TouchableOpacity style={styles.profilebutton} onPress={() => onPressProfile()}>
              <Image source={require('../assets/images/profile.png')} style={styles.profileimage} />
            </TouchableOpacity>

            {/* search bar */}
            <TextInput
              placeholder="Enter any Location"
              placeholderTextColor='black'
              style={styles.search}
              value={text}
              onChangeText={(text) => setText(text)}
              onSubmitEditing={() => handleSearch()}
              returnKeyType="search" />

            <TouchableOpacity style={styles.filter} onPress={show}>
              <Image source={require("../assets/images/filter.png")} resizeMode="contain" style={{ width: 40, height: 40 }} />
            </TouchableOpacity>
          </View>

          <Modal visible={visible} animationType='fade' onRequestClose={hide} transparent>
            <View style={styles.modal}>
              <TouchableOpacity style={[styles.button, selectedFilter === "Today" && styles.selectedButton]} onPress={() => applyfilter("Today")}>
                <Text style={[styles.modalText, selectedFilter === "Today" && styles.selectedText]}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, selectedFilter === "Tomorrow" && styles.selectedButton]} onPress={() => applyfilter("Tomorrow")}>
                <Text style={[styles.modalText, selectedFilter === "Tomorrow" && styles.selectedText]}>Tomorrow</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, selectedFilter === "Day 2" && styles.selectedButton]} onPress={() => applyfilter("Day 2")}>
                <Text style={[styles.modalText, selectedFilter === "Day 2" && styles.selectedText]}>Day 2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, selectedFilter === "Day 3" && styles.selectedButton, { height: 50, justifyContent: 'center' }]} onPress={() => applyfilter("Day 3")}>
                <Text style={[styles.modalText, selectedFilter === "Day 3" && styles.selectedText]}>Day 3</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <View style={{ width: Dimensions.get("screen").width }}>
            <WeatherSlide weatherData={weatherData} setBackground={setBackgroundColor} backgroundColors={backgroundColors} ref={weatherSliderRef} />
          </View>

          <Suggestions weatherData={weatherData} fetchCityData={fetchCityData} locationData={locationData} setLocationData={setLocationData} ref={weatherSliderRef} />

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
    width: '72%',
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
  filter: {
    marginTop: 25,
    marginStart: 5
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
  button: {
    height: 50,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: "grey",
    borderRadius: 10
  },
    selectedButton: {
      height: 50,
      justifyContent: 'center',
      borderBottomWidth: 0.5,
      borderBottomColor: "grey",
      backgroundColor: "#229ac8",
      borderRadius: 20
    },
    selectedText: {
      fontSize: 22,
      marginStart: 10,
      color: 'white',
      elevation: 10
    },
  modal: {
    backgroundColor: "#ffffff",
    width: 170,
    alignSelf: 'flex-end',
    marginEnd: 25,
    borderRadius: 20,
    marginTop: 65
  },
  modalText: {
    fontSize: 22,
    marginStart: 10
  },
});

export default Home;