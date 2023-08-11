import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios';
import { addUser } from '../store/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OTPVerify = ({ navigation, route }) => {
    const { email } = route.params;
    const [otp, setOtp] = useState('');
    const dispatch = useDispatch()

    const verifyOtp = async () => {
        try {
            const response = await axios.post('https://kwicondev.techdome.io/api/v2/auth/verify-login-otp', { email, otp })

            await AsyncStorage.setItem('user', JSON.stringify({
                token: response.data.tokens.access.token,
                user: response.data.user
            }));

            dispatch(addUser({
                token: response.data.tokens.access.token,
                user: response.data.user
            }));
        } catch (error) {
            console.log('OTP error', error.response.data.message)
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <TextInput
                onChangeText={setOtp}
                style={styles.textInput}
                placeholder='OTP'
                placeholderTextColor={'gray'}
                value={otp}
            />
            <TouchableOpacity style={styles.btn} onPress={verifyOtp}>
                <Text>Submit</Text>
            </TouchableOpacity>
        </View>
    )
}

export default OTPVerify

const styles = StyleSheet.create({
    textInput: {
        fontSize: 18,
        color: 'black',
        borderColor: 'black',
        borderWidth: 1
    },
    buttonText: {
        color: 'black'
    },
    btn: {
        backgroundColor: 'blue',
        padding: 10,
        marginTop: 10,
        borderRadius: 10
    }
})