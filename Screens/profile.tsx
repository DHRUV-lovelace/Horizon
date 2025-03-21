import { Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';

export default function Profile() {

  const Navigation = useNavigation<any>();
  const [email, setEmail] = useState("Email");
  const [name, setName] = useState("Name");
  const [age, setAge] = useState("Age");


  useEffect(() => { fetchUserData(); }, []);

  const fetchUserData = async () => {

    const accessToken = await AsyncStorage.getItem("accessToken")


    const userData = await fetch('https://dummyjson.com/user/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      credentials: 'include'
    });

    const data = await userData.json();

    if (data !== undefined) {
      try {
        setEmail((data.email).toString())
        setName((data.firstName).toString())
        setAge((data.age).toString())
      }
      catch (error) {
        console.error(error);
      }
    }
  };

  const saved = () => {
    Navigation.navigate('home')
  }

  const logout = async () => {
    await AsyncStorage.multiRemove(["accessToken", "refreshToken"])
    stackclear();
  };

  const stackclear = () => {
    Navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'login' }],
      })
    );
  };


  return (
    <View style={styles.container}>

      <Image source={require('../assets/images/profile.png')} style={styles.logo} />

      <View style={styles.textinput}>
        <TextInput
          placeholder='Email'
          placeholderTextColor='black'
          style={{ height: '100%', fontSize: 18, paddingLeft: 25 }}
          value={email}
        />
      </View>

      <View style={styles.textinput}>
        <TextInput
          placeholder='Name'
          placeholderTextColor='black'
          style={{ height: '100%', fontSize: 18, paddingLeft: 25 }}
          value={name}
        />
      </View>

      <View style={styles.textinput}>
        <TextInput
          placeholder='Age'
          placeholderTextColor='black'
          style={{ height: '100%', fontSize: 18, paddingLeft: 25 }}
          value={age}
        />
      </View>

      <View style={styles.containerrow}>
        <TouchableOpacity style={[styles.button, { backgroundColor: "#17B169" }]} onPress={() => saved()}>
          <Text style={styles.text}>Save</Text>
        </TouchableOpacity>

        <View style={styles.spacer}></View>

        <TouchableOpacity style={[styles.button, { backgroundColor: "#E32636" }]} onPress={() => logout()}>
          <Text style={styles.text}>Logout</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#888AB9',
    alignItems: 'center',
  },

  containerrow: {
    flex: 1,
    flexDirection: 'row',
  },

  spacer: {
    width: 30
  },

  logo: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginTop: 80,
    borderColor: '#E6E6FA',
    borderStyle: 'solid',
    borderCurve: 'continuous',
    borderRadius: 200,
    borderWidth: 10,
  },

  textinput: {
    width: '86%',
    height: 55,
    marginTop: 60,
    backgroundColor: 'white',
    borderRadius: 25,
    justifyContent: 'center',
  },

  button: {
    width: '35%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginTop: 100,
    elevation: 30
  },

  text: {
    color: "black",
    fontSize: 20,
    letterSpacing: 2
  }
});