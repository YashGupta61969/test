import { FlatList, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import decode from 'jwt-decode'
import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

let endpointUrl = 'https://techdome-chat-poc-acs.india.communication.azure.com/'

const Chat = ({ route }) => {
    const { id } = route.params.thread;
    const { token, user } = useSelector(state => state.user);
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const { azureAccessToken } = decode(token)

    const getMessages = async () => {
        try {

            let chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(azureAccessToken));
            const chatThreadClient = chatClient.getChatThreadClient(id);
            const messages = [];
            const messagesInThread = chatThreadClient.listMessages();
            for await (const message of messagesInThread) {
                if (message.type === 'text') {
                    messages.push(message)
                }
            }
            setMessages(messages)
        } catch (error) {
            console.log('error fetching messages', error)
        }
    }

    useEffect(() => {
        getMessages()
    }, [])

    const sendMessage = async () => {
        try {
            let chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(azureAccessToken));
            const chatThreadClient = chatClient.getChatThreadClient(id);
            const sendMessageRequest = {
                content: message
            };
            const sendMessageOptions = {
                senderDisplayName: user.name,
                type: 'text',
            };
            const messageSent = await chatThreadClient.sendMessage(sendMessageRequest, sendMessageOptions);
            getMessages()
            console.log('Message sent with the Id', messageSent)
        } catch (error) {
            console.log('error sending message', error)
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={messages}
                renderItem={({ item }) => {
                    return <TouchableOpacity style={styles.card}>
                        <Text style={styles.text}>{item.content.message}</Text>
                    </TouchableOpacity>
                }}
                contentContainerStyle={{ flex: 1 }}
            />

            <View style={{ flexDirection: 'row', }}>
                <TextInput
                    onChangeText={setMessage}
                    style={styles.textInput}
                    placeholder='Your Message Here'
                    placeholderTextColor={'gray'}
                    value={message}
                />
                <TouchableOpacity style={styles.btn} onPress={sendMessage}>
                    <Text>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Chat

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        color: 'black'
    },
    card: {
        backgroundColor: 'white',
        marginTop: 5,
        padding: 10
    },
    inputBox: {
        backgroundColor: 'black'
    },
    textInput: {
        fontSize: 18,
        color: 'black',
        borderColor: 'black',
        borderWidth: 1,
        width: '80%'
    },
    btn: {
        backgroundColor: 'blue',
        padding: 10,
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})