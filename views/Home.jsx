import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function Home({route}) {
  const [start_date_recortada, setstart_date] = useState('');
  const [arrayEvents, setarrayEvents] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const { token, id_user } = route.params || {};
  
  const handleEventsHome = async () => {
    try {
      const response = await axios.post('http://172.22.112.1:3000/api/event/100/0');
     
    } catch (error) {
      Alert.alert('Error de Login', error.response.data.message || 'No se pudo iniciar sesión. Por favor, intente nuevamente.');
    }
    }
    const selectEventsHome = async () => {  //próximos eventos
      try {
        const response = await axios.get('http://172.22.112.1:3000/api/event/100/0');
        const now = new Date();
        const filteredEvents = response.data.collection.map((evento) => {
          if ( evento.start_date === '2024-03-29T03:00:00.000Z' ) {
            setstart_date(evento.start_date.substring(0,10))
            return evento;
          } else console.log("no");
          return null;
        }).filter((evento) => evento !== null);
        setarrayEvents(filteredEvents);
      } catch (error) {
        setErrorMessage('Error al cargar eventos');
        console.error(error);
      }
    };
  
   
    useEffect(() => {
      selectEventsHome();
    }, []);
  
    return (
      <View style={styles.container}>
        <Text>Home</Text>
        <Text>Siguientes eventos: </Text>
        {arrayEvents.length > 0 ? (
          arrayEvents.map((evento, index) => (
            <Text key={index}>{evento.name} - {start_date_recortada}</Text> 
          ))
        ) : (
          <Text>No hay eventos</Text>
        )}
        {errorMessage ? <Text>{errorMessage}</Text> : null}
        <StatusBar style="auto" /><Button title="+" onPress ={()=> navigation.navigate('Formulario', {token, id_user})} />
      </View>
    );
  }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});