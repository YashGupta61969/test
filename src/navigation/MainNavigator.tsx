import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'

import Login from '../screens/Login'
import { useSelector } from 'react-redux';

type Props = {}

const Stack = createNativeStackNavigator();

const MainNavigator = (props: Props) => {
    const token = useSelector(state => state.user)
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={Login} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigator