import React, { useRef, forwardRef } from "react";
import { View, Text, Image, StyleSheet, Dimensions, FlatList, ImageBackground} from "react-native";

type weatherProps = {
  weatherData: any,
  setBackground: React.Dispatch<React.SetStateAction<string>>,
  ref: React.RefObject<FlatList<any>>
}

const weatherIcons = {
  "01d": require("../assets/images/01d.png"),
  "02d": require("../assets/images/02d.png"),
  "03d": require("../assets/images/03d.png"),
  "04d": require("../assets/images/04d.png"),
  "09d": require("../assets/images/09d.png"),
  "10d": require("../assets/images/10d.png"),
  "11d": require("../assets/images/11d.png"),
  "13d": require("../assets/images/13d.png"),
  "50d": require("../assets/images/50d.png"),
  "01n": require("../assets/images/01n.png"),
  "02n": require("../assets/images/02n.png"),
  "03n": require("../assets/images/03n.png"),
  "04n": require("../assets/images/04n.png"),
  "09n": require("../assets/images/09n.png"),
  "10n": require("../assets/images/10n.png"),
  "11n": require("../assets/images/11n.png"),
  "13n": require("../assets/images/13n.png"),
  "50n": require("../assets/images/50n.png"),
};

const backgroundColors = {
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

const WeatherSlide = ({weatherData, setBackground, ref}: weatherProps) => {

  const renderItems = ({ item }) => {

    return (
      <View style={{borderRadius: 30}}>
        <ImageBackground blurRadius={40} style = {styles.blur}>
          <View style={styles.slide}>
              <Text style={styles.text}>{item?.id}</Text>
              <Image source={weatherIcons[item.icon]} style={styles.weatherimage} />
              <Text style={[styles.text, {marginTop: 20}]}>{item?.description}</Text>

              <View style = {styles.containerrow}>
                <Text style={styles.text}>{item?.temp}</Text>
                <Text style={styles.text2}>°C</Text>
              </View>

              <View style = {styles.containerrow}>
                <Text style={styles.text}>{item?.pressure}</Text>
                <Text style={styles.text2}>hpa</Text>
              </View>

              <View style = {styles.containerrow}>
                <View style = {styles.containerrow}>
                  <Text style={styles.text}>{item?.humidity}</Text>
                  <Text style={styles.text2}>%</Text>
                </View>
                <View style = {[styles.containerrow, {marginStart: 20}]}>
                  <Text style={styles.text}>{item?.wind}</Text>
                  <Text style={styles.text2}>km/h</Text>
                </View>
              </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const activeItem = viewableItems[0].item;
      const newBackground = backgroundColors[activeItem.icon] || "#000000";
      setBackground(newBackground);
    }
  };

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

  return (

    <FlatList
      style={{ alignSelf: "center", marginTop: 60}}
      ref={ref}
      data={weatherData}
      renderItem={renderItems}
      keyExtractor={(_item, index) => index.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: (Dimensions.get("window").width - Dimensions.get("window").width * 0.85) / 2,
      }}
      snapToInterval={Dimensions.get("window").width* 0.85} 
      snapToAlignment="start"
      decelerationRate="fast"
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
    },
    containerrow: {
      flexDirection: "row",

    },
    containercolumn: {
      flexDirection: 'column',
    },
  carouselitem: {
      flex: 1,
      flexDirection: 'column',
      margin: 20,
      backgroundColor: 'white'
    },
  weatherimage: {
      width: 270,
      height: 270,
      alignSelf: 'center',
      marginTop: 50,
      padding: 5
    },
    text: {
      color: 'white',
      fontWeight: '500',
      fontSize: 44,
    },
    text2 :{
      color: 'white',
      fontWeight: '400',
      fontSize: 28,
      marginStart: 3,
      textAlignVertical: 'center'
    },
    slide: {
      width: Dimensions.get("window").width * 0.85,
      alignSelf: 'center',
      borderWidth: 8,
      borderRadius: 30,
      borderColor: "white",
      alignItems: "center",
      marginHorizontal: 0
    },
    blur: {
      borderRadius: 40,
    }
  }
);

export default WeatherSlide;