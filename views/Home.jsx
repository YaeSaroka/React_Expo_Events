import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function Home({ route }) {
  const [arrayEvents, setArrayEvents] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [eventorotar, setEventoRotar] = useState([]);
  //INSERT INTO public.users (id, first_name, last_name, username, "password") VALUES (3, N'Admin', N'Admin', N'administrador@ad.com.ar', N'admin');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [id_event_category, setId_event_category] = useState(0);       
  const [id_event_location, setId_event_location] = useState(0);       
  const [startDate, setStartDate] = useState('');
  const [duration_in_minutes, setDuration_in_minutes] = useState(0);
  const [price, setPrice] = useState(0);
  const [max_assistance, setMax_assistance] = useState(0);
  const [enabled_for_enrollment, setenabled_enrollement] = useState(true);

  const navigation = useNavigation();
  const { token, id_user, username } = route.params || {};

  const getCurrentDate = () => new Date().toISOString();
  const hoy = getCurrentDate();

  const selectEventsHome = async () => {
    try {
      const response = await axios.get('http://10.152.2.143:3000/api/event/100/0');
      const filteredEvents = response.data.collection.filter(evento => evento.start_date >= hoy);
      setArrayEvents(filteredEvents);
    } catch (error) {
      setErrorMessage('Error al cargar eventos');
      console.error(error);
    }
  };

  const inscribirUser = async (evento) => {
    console.log(evento);
    if (evento.enabled_for_enrollment) {
      try {
        const response = await axios.post(`http://10.152.2.143:3000/api/event/${id_user}/enrollment`,
          {
            description: evento.description,
            attended: false,
          },
          {
            headers: {
              id_event: evento.id,
              Authorization: `Bearer ${token}` 
            }
          }
        );
        if (response.data.success) {
          console.log("funcionó modal inscrip");
          openModal(); // Modal de éxito
        }
      } catch (error) {
        if (error.response) {
          let errorMessage = error.response.data.message || 'Error en la inscripción';
          console.log("error inscrip", error);
          setErrorMessage(errorMessage.substring(12)); // error :))
          openModal2(); //modal del error, falta css claramente
        } else {
          console.log("Error de conexión: No se pudo conectar al servidor.");
        }
      }
    } else {
      setErrorMessage('El evento no está habilitado para la inscripción.');
      openModal2(); 
    }
  };

  const editarEvento = async (evento) => {
    setEventoRotar(evento); //agarra el evento del boton
    setName(evento.name);
    setDescription(evento.description);
    setStartDate(evento.start_date);
    setDuration_in_minutes(evento.duration_in_minutes.toString());
    setPrice(evento.price.toString());
    setMax_assistance(evento.max_assistance.toString());
    setenabled_enrollement(evento.enabled_for_enrollment);
    openModal3(); // modal especif

    //form para cambiar las variables (como el de "Formulario.jsx" y llamar a la axios "put(editar)" y pushear esoss mismos datos y listo :)!
    // para eliminar lo mismo, onpress, axios y listo
    // eventos pasados --> filtrar eventos antes de hoy (filter(evento => evento.start_date < hoy)y hacer un array aparte con esos y mostrarlos!
  
  };

  useEffect(() => {
    selectEventsHome();
  }, []);

  const openModal = () => setModalVisible(true);
  const openModal2 = () => setModalVisible2(true);
  const openModal3 = () => setModalVisible3(true);
  const closeModal = () => {
    setModalVisible(false);
    setModalVisible2(false);
    setModalVisible3(false);
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>Siguientes eventos:</Text>
        {arrayEvents.length > 0 ? (
          arrayEvents.map((evento, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.eventText}>{evento.name}</Text>
              <Text style={styles.dateText}>{evento.start_date.substring(0, 10)}</Text>
              {username === "administrador@ad.com.ar" ? (
                <TouchableOpacity style={styles.boton} onPress={() => editarEvento(evento)}>
                  <Text style={styles.botonText2}>Editar</Text>
                </TouchableOpacity>
              ) : (
                <Text></Text>
              )}
              <TouchableOpacity style={styles.boton} onPress={() => inscribirUser(evento)}>
                <Text style={styles.botonText2}>Inscribirse</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noEventsText}>No hay eventos</Text>
        )}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('Formulario', { token, id_user })}>
          <Text style={styles.botonText}>+</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>

      {/* modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>¡ Inscripto !</Text>
            <TouchableOpacity style={styles.button} onPress={closeModal}>
              <Text>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal ERROR */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{errorMessage}</Text>
            <TouchableOpacity style={styles.button} onPress={closeModal}>
              <Text>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/*act admin - modal*/}
      <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible3}
      onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{eventorotar.name}</Text>
            <TouchableOpacity style={styles.button} onPress={closeModal}>
              <Text>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffd9df',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 19,
    color: '#333',
    marginBottom: 40,
    fontWeight: 'bold',
  },
  subtitle: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#7f6065',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginVertical: 10,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventText: {
    fontSize: 18,
    fontWeight: 'medium',
    color: '#444',
  },
  dateText: {
    fontSize: 14,
    color: '#777',
  },
  noEventsText: {
    fontSize: 16,
    color: '#888',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
  boton: {
    padding: 10,
    backgroundColor: '#7f6065',
    borderRadius: 5,
    width: 100,
    alignItems: 'center',
  },
  botonText: {
    color: '#fff',
    fontSize: 18,
  },
  botonText2: {
    color: '#fff',
    fontSize: 12,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark background
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#007bff',
  },
});
