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
        <View style={styles.container}>

        {response}
  <Text style={styles.label}>Nombre:</Text>
  <TextInput
    style={styles.input}
    value={name}
    onChangeText={setName}
    placeholder="Ingrese su nombre"
  />
   <Text style={styles.label}>Descripción</Text>
  <TextInput
  style={styles.input}
  value={description}
  onChangeText={setDescription}
  placeholder=""
/>
<Text style={styles.label}>Categoría</Text>
<TextInput
  style={styles.input}
  value={id_event_category}
  onChangeText={setId_event_category}
  placeholder=""
/>
<Text style={styles.label}>Ubicacion</Text>
<TextInput
  style={styles.input}
  value={id_event_location}
  onChangeText={setId_event_location}
  placeholder=""
/>
  <Text style={styles.label}>Fecha de Inicio:</Text>
  <TextInput
    style={styles.input}
    value={startDate}
    onChangeText={setStartDate}
    placeholder="YYYY-MM-DD"
  />
   <Text style={styles.label}>Duración</Text>
  <TextInput
  style={styles.input}
  value={duration_in_minutes}
  onChangeText={setId_event_location}
  placeholder="Duracion"
/>
<Text style={styles.label}>Precio</Text>
  <TextInput
  style={styles.input}
  value={price}
  onChangeText={setPrice}
  placeholder=""
/>
<Text style={styles.label}>Máxima asistencia</Text>
  <TextInput
  style={styles.input}
  value={max_assistance}
  onChangeText={setMax_assistance}
  placeholder=""
/>
<TextInput
    style={styles.hiddenInput}
    value={true}
    onChangeText={setEnabled_enrollement}
    editable={false} 
  />
  <TextInput
    style={styles.hiddenInput}
    value={id_creator_user}
    onChangeText={setId_creator_user}
    editable={false} 
  />
</View>
       
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
 