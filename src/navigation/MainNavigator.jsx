import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react'

import Login from '../screens/Login'
import Chats from '../screens/Chats';
import OTPVerify from '../screens/OTPVerify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../store/slices/userSlice';
import Chat from '../screens/Chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClient } from '@azure/communication-chat';
import decode from 'jwt-decode'
import { TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    const dispatch = useDispatch()
    const { token } = useSelector(state => state.user);

    const getToken = async () => {
        const details = await AsyncStorage.getItem('user');
        const parsed = JSON.parse(details)
        dispatch(addUser(parsed))
    }

    const startListener = async () => {
        try {
            let endpointUrl = 'https://techdome-chat-poc-acs.india.communication.azure.com/'
            const { azureAccessToken } = decode(token)
            let chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(azureAccessToken));

            await chatClient.startRealtimeNotifications();
            console.log('Now listening for real time Notifications')
            chatClient.on("chatMessageReceived", (e) => {
                console.log("Notification chatMessageReceived!", e);
            });
            chatClient.on("typingIndicatorReceived", (e) => {
                console.log("Typing Received!", e);
            });
            return () => chatClient.stopRealtimeNotifications()
        } catch (error) {
            console.log('Error listening noti', error)
        }

    }

    useEffect(() => {
        getToken()
    }, [])

    useEffect(() => {
        token && startListener()
    }, [token])

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {
                    !token ? <>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="VerifyOTP" component={OTPVerify} />
                    </> : <>
                        <Stack.Screen name="Chats" component={Chats} options={{
                            // headerRight:(e) => {
                            //     <TouchableOpacity>
                            //         <Text>              </Text>
                            //     </TouchableOpacity>
                            // }
                        }}/>
                        <Stack.Screen name="Chat" component={Chat} options={({ route }) => {
                            return { title: route.params.thread.topic }
                        }} />
                    </>
                }
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigator