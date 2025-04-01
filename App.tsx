import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Screens/login';
import Profile from './Screens/profile';
import Home from './Screens/home';
import { Provider } from 'react-redux';
import { store } from './redux/store'

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="home" component={Home} />
          <Stack.Screen name="profile" component={Profile} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;