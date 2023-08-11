import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const getOtp = async () => {
        try {
            const response = await axios.post('https://kwicondev.techdome.io/api/v2/auth/get-login-otp', { email })
            if (response.status === 200) {
                navigation.navigate('VerifyOTP', { email })
            }
        } catch (error) {
            console.log(error.response.data.message)
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <TextInput
                onChangeText={setEmail}
                style={styles.textInput}
                placeholder='Email'
                placeholderTextColor={'gray'}
                value={email}
            />
            <TouchableOpacity style={styles.btn} onPress={getOtp}>
                <Text>Submit</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Login

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