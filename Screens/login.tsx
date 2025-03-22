import { Text, StyleSheet, View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {

    const Navigation = useNavigation<any>();

    Navigation.clear

    const passwordRef = useRef<TextInput>(null);

    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordShow, setPasswordShow] = useState(false);

    const passwordIcon = {
        false: require("../assets/images/visible.png"),
        true: require("../assets/images/hide.png")
    }

    useEffect(() => { checkLogin(); }, []);

    const checkLogin = async () => {

        const accessToken = await AsyncStorage.getItem("accessToken")
        const refreshToken = await AsyncStorage.getItem("refreshToken")

        const userData = await fetch('https://dummyjson.com/user/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            credentials: 'include'
        });

        const data = await userData.json();

        if (data !== undefined) {
            if (data.id) {
                Navigation.replace('home')
                return
            }
            try {
                const response = await fetch('https://dummyjson.com/auth/refresh', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        refreshToken: `${refreshToken}`,
                        expiresInMins: 30,
                    }),
                    credentials: 'include'
                })

                const datanew = await response.json();
                const accesstokennew = (datanew.accessToken).toString()
                const refreshtokennew = (datanew.refreshToken).toString()

                await AsyncStorage.setItem("accessToken", accesstokennew)
                await AsyncStorage.setItem("refreshToken", refreshtokennew)

                if (datanew.accesstoken) {
                    loginToast(true);
                    homeNav();
                }
            }
            catch (error) {
                console.log(error)
            }
        }
    }

    const loginUser = async () => {

        const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: (userName).toLowerCase(),
                password: (password).toLowerCase(),
                expiresInMins: 30,
            }),
            credentials: 'include'
        });

        const data = await response.json();

        const accesstoken = (data.accessToken).toString()
        const refreshtoken = (data.refreshToken).toString()

        if (data.accessToken !== undefined) {
            try {
                await AsyncStorage.setItem('accessToken', accesstoken);
            }
            catch (error) {
                console.error(error);
            }
        }

        if (data.refreshToken !== undefined) {
            try {
                await AsyncStorage.setItem('refreshToken', refreshtoken);
            }
            catch (error) {
                console.error(error);
            }
        }

        if (data.accessToken !== undefined) {
            loginToast(true);
            homeNav();
        }
        else if (data === Object) {
            loginToast(false);
        }
    };

    const homeNav = () => {
        Navigation.replace('home');
    };

    const loginToast = (code: boolean) => {
        if (code === true) {
            Toast.show({
                type: "success",
                text1: "login success",
            });
        }
        else if (code === false) {
            Toast.show({
                type: "error",
                text1: "Login failed",
            });
        }
        else {
            Toast.show({
                type: "error",
                text1: "Please Login",
            });
        }
    };

    const changeFocus = () => {
        if (passwordRef.current) {
            passwordRef.current.focus();
        }
    };

    const togglePassword = () => {
        if (passwordShow){
            setPasswordShow(false)
        }
        else{
            setPasswordShow(true)
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding' keyboardVerticalOffset={20}>
            <ScrollView style={{flex: 1}} contentContainerStyle={{alignItems: 'center'}}>

            <Toast />

            <Image source={require('../assets/images/logo.png')} style={styles.logo} />

            <Text style={styles.title}>Horizon</Text>

            <View style={styles.textinput}>
                <TextInput
                    placeholder='Enter username'
                    placeholderTextColor={'black'}
                    style={{ height: '100%', fontSize: 18, paddingLeft: 25, paddingRight: 25}}
                    value={userName}
                    onChangeText={(text) => setUserName(text)}
                    onSubmitEditing={changeFocus}
                    autoFocus={false}
                    maxLength={6}
                />
            </View>

            <View style={[styles.textinput, {flexDirection: 'row'}]}>
                <TextInput
                    ref={passwordRef}
                    placeholder='Enter password'
                    placeholderTextColor={'black'}
                    style={{ width: "86%", height: '100%', fontSize: 18, paddingLeft: 25, color: "#000000", paddingRight: 25}}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    maxLength={10}
                    secureTextEntry={passwordShow}
                />
                <TouchableOpacity style={{width: 40, height: 40, alignSelf: 'center', justifyContent: 'center'}} onPress={()=>{togglePassword()}}>
                    <Image source={passwordIcon[passwordShow]} style={{width: 30, height:30, alignSelf: 'center'}}/>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.login} onPress={loginUser}>
                <Text style={{ color: 'black', fontSize: 25 }}>Login</Text>
            </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#888AB9',
    },

    logo: {
        width: 300,
        height: 300,
        alignSelf: 'center',
        marginTop: 80
    },

    title: {
        color: 'white',
        fontSize: 40,
        fontWeight: '300',
        letterSpacing: 10,
        shadowOpacity: 100,
        shadowColor: 'green',
        shadowOffset: {
            width: 10,
            height: 50
        },
    },

    textinput: {
        flexDirection: 'column',
        width: '88%',
        height: 55,
        marginTop: 60,
        backgroundColor: 'white',
        borderRadius: 25,
    },

    login: {
        width: '35%',
        height: 60,
        backgroundColor: '#F1BC19',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        marginTop: 100,
        elevation: 25
    }
});