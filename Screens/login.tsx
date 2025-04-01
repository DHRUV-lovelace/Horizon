import { Text, StyleSheet, View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Pressable, ImageSourcePropType } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAppDispatch } from '../redux/hooks'
import { getLogin } from '../redux/slices/loginUserSlice'

export default function Login() {

    const Navigation = useNavigation<any>();

    const passwordRef = useRef<TextInput>(null);

    const dispatch = useAppDispatch();

    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordShow, setPasswordShow] = useState(false);
    const [icon, setIcon] = useState(0)

    const passwordIcon: Record<number, ImageSourcePropType> = {
        0: require("../assets/images/visible.png"),
        1: require("../assets/images/hide.png")
    }

    useEffect(() => { checkLogin(); }, []);

    const checkLogin = async () => {

        const accessToken = await AsyncStorage.getItem("accessToken")
        const refreshToken = await AsyncStorage.getItem("refreshToken")

        const userData = await fetch(`${process.env.currentAuthURL}`, {
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
                const response = await fetch(`${process.env.refreshURL}`, {
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

        if (userName === "" || password === "") {
            loginToast();
            return
        }

        const data = await dispatch(getLogin({ userName, password }));
        console.log(data, "logindata")

        if (data?.payload?.status == true) {
            if (data.payload.message) {
                loginToast(false)
                return
            }
        }

        const accesstoken = (data.payload.accessToken).toString()
        const refreshtoken = (data.payload.refreshToken).toString()

        if (data.payload.accessToken !== undefined) {
            try {
                await AsyncStorage.setItem('accessToken', accesstoken);
            }
            catch (error) {
                console.error(error);
            }
        }

        if (data.payload.refreshToken !== undefined) {
            try {
                await AsyncStorage.setItem('refreshToken', refreshtoken);
            }
            catch (error) {
                console.error(error);
            }
        }

        if (data.payload.accessToken !== undefined) {
            loginToast(true);
            homeNav();
        }
        else if (data.payload === Object) {
            loginToast(false);
        }
    };

    const homeNav = () => {
        Navigation.replace('home');
    };

    const loginToast = (code?: boolean) => {
        if (code === true) {
            Toast.show({
                type: "success",
                text1: "login success",
            });
        }
        else if (code === false) {
            Toast.show({
                type: "error",
                text1: "Incorrect username or password",
            });
        }
        else {
            Toast.show({
                type: "error",
                text1: "Please provide an input",
            });
        }
    };

    const changeFocus = () => {
        if (passwordRef.current) {
            passwordRef.current.focus();
        }
    };

    const togglePassword = () => {
        if (passwordShow) {
            setPasswordShow(false)
            setIcon(0)
        }
        else {
            setPasswordShow(true)
            setIcon(1)
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding' keyboardVerticalOffset={20}>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center' }}>

                <Image source={require('../assets/images/logo.png')} style={styles.logo} />

                <Toast />
                <Text style={styles.title}>Horizon</Text>
                <View style={styles.textinput}>
                    <TextInput
                        placeholder='Enter username'
                        placeholderTextColor={'black'}
                        style={{ height: '100%', fontSize: 18, paddingLeft: 25, paddingRight: 25 }}
                        value={userName}
                        onChangeText={(text) => setUserName(text)}
                        onSubmitEditing={changeFocus}
                        autoFocus={false}
                        maxLength={6}
                    />
                </View>

                <View style={[styles.textinput, { flexDirection: 'row' }]}>
                    <TextInput
                        ref={passwordRef}
                        placeholder='Enter password'
                        placeholderTextColor={'black'}
                        style={{ width: "86%", height: '100%', fontSize: 18, paddingLeft: 25, color: "#000000", paddingRight: 25 }}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        maxLength={10}
                        secureTextEntry={passwordShow}
                    />
                    <TouchableOpacity style={{ width: 40, height: 40, alignSelf: 'center', justifyContent: 'center' }} onPress={() => { togglePassword() }}>
                        <Image source={passwordIcon[icon]} style={{ width: 30, height: 30, alignSelf: 'center' }} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 100, borderRadius: 0 }}>
                    <View style={styles.loginView}>
                        <Pressable style={styles.login} onPress={loginUser} android_ripple={{ color: "#f3e3f3" }}>
                            <Text style={{ color: 'black', fontSize: 25 }}>Login</Text>
                        </Pressable>
                    </View>
                </View>

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
        width: 120,
        height: 60,
        backgroundColor: '#F1BC19',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
    },
    loginView: {
        overflow: 'hidden',
        elevation: 25,
        borderRadius: 25
    }
});