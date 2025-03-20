import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity} from "react-native";
import WeatherSlide from "./WeatherSlides";

type sugggestionsProps ={
    weatherData: any,
    fetchCityData : React.Dispatch<string>
    ref: React.RefObject<FlatList<any>>
}

type locationData ={
    name: string,
    temp: string
}

const Suggestions = ({weatherData, fetchCityData, ref}: sugggestionsProps) => {

    const API_KEY = "944e56c6401479371c1e394a4f0a1ecd";

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

    useEffect(() => {fetchAllWeatherData();}, []);

    const detailsShow = (item) => {
        fetchCityData(item.name);
        let name = item.name;
        let index = weatherData.findIndex((item) => item.id == name)
        if (index != -1){
            ref.current.scrollToIndex({animated: true, index: index})
        }     
    };

    const fetchWeatherData = async (latitude: number, longitude: number) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
    
        try {
          const response = await fetch(url);
          const data = await response.json();

          return (data.main.temp - 273.15).toFixed(1)
        }
        catch (error) {
          console.error("Error fetching weather data:", error);
        }
    };

    const fetchlocation = async (city: string) => {
        const limit = 1;
        const city_url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${API_KEY}`;
    
        try {
          const response = await fetch(city_url);
          const data = await response.json();
          console.log(data);
  
          if (data.length > 0) {
            return { latitude: data[0].lat, longitude: data[0].lon };
          }
        }
        catch (error) {
          console.error("Error fetching weather data:", error);
          return { latitude: 0, longitude: 0 }; 
        }
    };

    const fetchAllWeatherData = async() => {
        const updatedLocations = await Promise.all(
                                                    locationData.map(async (item) => {
                                                        const location = await fetchlocation(item.name) ?? { latitude: 0, longitude: 0 }; 

                                                        if (!location || location.latitude === undefined || location.longitude === undefined) {
                                                            console.error(`Failed to fetch location for ${item.name}`);
                                                            return { ...item, temp: "_ _" }; 
                                                        }
                                                        const temp = await fetchWeatherData(location.latitude, location.longitude);
                                                        return { ...item, temp: temp !== undefined? temp: "_ _" };
                                                    })
                                                    );

        setLocationData(updatedLocations);
    }

    const renderItems = ({item}) => {
        return(
            <TouchableOpacity style = {styles.container} onPress={() => {detailsShow(item);}}>
                <Text style = {styles.text}>{item.name}</Text>
                <View style = {styles.containerrow}>
                    <Text style={styles.text1}>{item.temp}</Text>
                    <Text style={styles.text2}>°C</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return(
        <FlatList
            style={{ alignSelf: "center", marginTop: 50}}
            data={locationData}
            renderItem={renderItems}
            keyExtractor={(_item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            re
        />
    );
};

const styles = StyleSheet.create({
    container: {
        width: 120,
        height: 65,
        borderWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 25,
        borderRadius: 15,
        borderColor: "#ffffff"       
    },
    containerrow: {
        flexDirection: 'row'
    },
    text: {
        fontSize: 20,               
        fontWeight: "bold",
        color: "#ffffff",
    },
    text1: {
        color: 'white',
        fontWeight: '500',
        fontSize: 24,
    },
    text2 :{
    color: 'white',
    fontWeight: '400',
    fontSize: 20,
    marginStart: 3,
    textAlignVertical: 'center'
    },
});

export default Suggestions;