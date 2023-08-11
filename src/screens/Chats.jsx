import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import decode from 'jwt-decode'
import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

let endpointUrl = 'https://techdome-chat-poc-acs.india.communication.azure.com/'

const Chats = ({navigation}) => {
  const { token } = useSelector(state => state.user)
  const [threads, setThreads] = useState([])

  const getThreads = async () => {
    const { azureAccessToken } = decode(token)

    let chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(azureAccessToken));
    const threadsList = chatClient.listChatThreads();
    let threads = []
    for await (const thread of threadsList) {
      threads.push(thread)
    }
    setThreads(threads)
  }

  useEffect(() => {
    getThreads()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={threads}
        renderItem={({ item }) => {
          return <TouchableOpacity style={styles.card} onPress={()=>{
            navigation.navigate('Chat', {thread: item})
          }}>
            <Text style={styles.text}>{item.topic}</Text>
          </TouchableOpacity>
        }}
      />
    </View>
  )
}

export default Chats

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: 'black'
  },
  card: {
    backgroundColor: 'white',
    marginTop: 5,
    padding: 10
  }
})