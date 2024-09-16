import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, Button, Alert} from 'react-native';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function Formulario({ response }) {
  const [start_date, setstart_date] = useState('');
  const [arrayEvents, setarrayEvents] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [id_event_category, setId_event_category] = useState('');
  const [id_event_location, setId_event_location] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration_in_minutes, setDuration_in_minutes] = useState('');
  const [price, setPrice] = useState('');
  const [max_assistance, setMax_assistance] = useState('');
  const [enabled_enrollement, setEnabled_enrollement] = useState('');
  const [id_creator_user, setId_creator_user] = useState('');
 
  const handleCreateEvent = async ( ) => { 
    try {
      const response = await axios.post('http://172.18.224.1:3000/api/event', {name, description, id_event_category, id_event_location,start_date, duration_in_minutes, price, max_assistance, enabled_enrollement, id_creator_user });
      if (response.data.success){
       
      }
    } catch (error) {
      Alert.alert('Error de Login', error.response.data.message || 'No se pudo iniciar sesión. Por favor, intente nuevamente.');
    }
    }
    console.log(response)
    return (
       <Text>dfsd</Text>
       
    )}

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          padding: 16,
          justifyContent: 'center',
          backgroundColor: '#fff'
        },
        label: {
          fontSize: 16,
          marginBottom: 8
        },
        input: {
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          marginBottom: 16,
          paddingHorizontal: 8,
          borderRadius: 4
        },
            hiddenInput: {
              height: 0,
              borderColor: '#fff',
              borderWidth: 0,
              marginBottom: 16,
              paddingHorizontal: 0,
              borderRadius: 4,
              opacity: 0 
            }
          });
 