import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function Home({ route }) {
  const [arrayEvents, setArrayEvents] = useState([]);
  const [arrayEvents_pasados, setArrayEvents_pasados] = useState([]);
  const [persona_nombre, setPersonaNombre ] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const [modalVisible5, setModalVisible5] = useState(false);
  const [eventoActual, setEventoElegido] = useState({});
  //INSERT INTO public.users (id, first_name, last_name, username, "password") VALUES (3, N'Admin', N'Admin', N'administrador@ad.com.ar', N'admin');

  //falta corregir el tema de enabled, no se cambia a false cuando debería cambiar.
  const [id_event_category, setId_event_category] = useState(0);       
  const [id_event_location, setId_event_location] = useState(0);     
  const [enabled_for_enrollment, setenabled_enrollement] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration_in_minutes, setDuration_in_minutes] = useState(0);
  const [price, setPrice] = useState(0);
  const [max_assistance, setMax_assistance] = useState(0);
  const [id_evento, setIdEvento] = useState(0);

  const navigation = useNavigation();
  const { token, id_user, username } = route.params || {};
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  
  const getCurrentDate = () => new Date().toISOString();
  const hoy = getCurrentDate();

  const selectEventsHome = async () => {
    try {
      const response = await axios.get('http://10.144.1.38:3000/api/event/100/0');
      const filteredEvents = response.data.collection.filter(evento => evento.start_date >= hoy);
      const filteredEvents_pasados = response.data.collection.filter(evento => evento.start_date < hoy);
      setArrayEvents(filteredEvents);
      setArrayEvents_pasados(filteredEvents_pasados);
    } catch (error) {
      setErrorMessage('Error al cargar eventos');
      console.error(error);
    }
  };

  const inscribirUser = async (evento) => {
    if (evento.enabled_for_enrollment) {
      try {
        const response = await axios.post(`http://10.144.1.38:3000/api/event/${id_user}/enrollment`,
          {
            description: evento.description,
            attended: false,
          },
          {
            headers: {
              id_event: evento.id,
              authorization: `Bearer ${token}` 
            }
          }
        );
        if (response.data.success) {
          console.log("funcionó modal inscrip");
          openModal(); // Modal de éxito
        }
      } catch (error) {
        if (error.response) {
          let errorMessage = error.response.data || 'Error en la inscripción';
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

  const modalEvento_edit = async (evento) => {
    openModal3();
    setName(evento.name || ''); //manejo de errores
    setDescription(evento.description || '');
    setStartDate(evento.start_date || '');
    setDuration_in_minutes(evento.duration_in_minutes || 0);
    setId_event_category(evento.id_event_category);
    setId_event_location(evento.id_event_location);
    setPrice(evento.price || 0);
    setMax_assistance(evento.max_assistance || 0);
    setenabled_enrollement(evento.enabled_for_enrollment);
    setIdEvento(evento.id);
  };

  const editEvent = async () => {
    try {
      const response = await axios.put('http://10.144.1.38:3000/api/event', {
        name,
        description,
        id_event_category,
        id_event_location,
        start_date: startDate,
        duration_in_minutes,
        price,
        enabled_for_enrollment, 
        max_assistance,
        id_creator_user: id_user,
        id: id_evento, 
      }, config);
  
      if (response.data.success) {
        console.log("Evento actualizado correctamente");
        await selectEventsHome(); // CARGA TODOS LOS EVENTOS DE VUELTA ANTE LOS CAMBIOS :)
        closeModal();
      } else {
        console.error("Error al actualizar el evento:", response.data.message);
      }
    } catch (error) {
      console.error("Error de conexión:", error.message || error);
    }
  };
  
  const eliminarEvento = async () => {
    const evento_id = eventoActual.id
    console.log(evento_id);
    try {
      console.log("hola -- ")
      const response = await axios.delete(`http://10.144.1.38:3000/api/event/${evento_id}`, config);
     //Error error: update o delete en «events» viola la llave foránea «fk_event_enrollments_events» en la tabla «event_enrollments»    --> aveces pasa y quiere decir que se eliminó
        if (response.data.success) {
            console.log("Evento eliminado correctamente");
            await selectEventsHome(); // CARGA TODOS LOS EVENTOS DE VUELTA ANTE LOS CAMBIOS :)
            // aveces, depende del día, dice --> update o delete en «events» viola la llave foránea «fk_event_enrollments_events» en la tabla «event_enrollments»      ((funciona))
            closeModal();
        } else {
            console.error("Error al eliminar el evento:", response.data.message);
        }
    } catch (error) {
        console.error("Error de conexión:", error.message || error);
    }
  };

 

  useEffect(() => {
    selectEventsHome();
  }, []);

  const openModal = () => setModalVisible(true);
  const openModal2 = () => setModalVisible2(true);
  const openModal3 = () => setModalVisible3(true);
  const modalEvento_eliminar = (evento) => {
    setEventoElegido(evento)
    setModalVisible4(true); //modal de estas seguro de eliminar?
  } 
  const modalEvento_detalle = async (evento) => {
    setModalVisible5(true);
    setEventoElegido(evento);
    
    try {
      const response = await axios.get(`http://10.144.1.38:3000/api/event-enrollment/`, {
        params: { id: evento.id },
      });

      if (response?.data) {
        const personas = response.data;
        if (Array.isArray(personas)) {
          const personasFiltradas = personas.filter(persona => evento.id === persona.id_event);

          if (personasFiltradas.length > 0) {
            const nuevosNombres = await Promise.all(
              personasFiltradas.map(async (persona) => {
                const nombre = await cargarNombreUsers(persona.id_user);
                return { id: persona.id_user, ...nombre }; 
              })
            );

            setPersonaNombre(nuevosNombres);
          } else {
            console.log("No se encontraron personas para este evento.");
          }
        }
      }
    } catch (error) {
      console.error("Error de conexión:", error.message || error);
    }
  };
  const cargarNombreUsers = async (persona_id) => {
    try {
      const response = await axios.get(`http://10.144.1.38:3000/api/user/find`, {
        params: { id: persona_id }, 
      });
      if (response.data) {
        return { first_name: response.data.first_name, last_name: response.data.last_name };
      }
    } catch (error) {
      console.error("Error de conexión:", error.message || error);
    }
    return null;
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalVisible2(false);
    setModalVisible3(false);
    setModalVisible4(false);
    setModalVisible5(false);
    setPersonaNombre([]);
  };
  useEffect(() => {
    console.log("persona_nombre actualizado:", persona_nombre);
  }, [persona_nombre]);

  return (
    <>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.subtitle}>Siguientes eventos:</Text>
      {arrayEvents.length > 0 ? (
        arrayEvents.map((evento, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.eventText}>{evento.name}</Text>
            <Text style={styles.dateText}>{evento.start_date.substring(0, 10)}</Text>
              {username === "administrador@ad.com.ar" ? (
                <>
                  <TouchableOpacity style={styles.boton} onPress={() => modalEvento_edit(evento)}>
                    <Text style={styles.botonText2}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.boton} onPress={() => modalEvento_eliminar(evento)}>
                    <Text style={styles.botonText2}>Eliminar</Text>
                  </TouchableOpacity>
                </>
              ) : null}
              <TouchableOpacity style={styles.boton} onPress={() => inscribirUser(evento)}>
                <Text style={styles.botonText2}>Inscribirse</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.boton} onPress={() => modalEvento_detalle(evento)}>
                <Text style={styles.botonText2}>Ver detalle</Text>
              </TouchableOpacity>
            </View>
        ))
      ) : (
        <Text style={styles.noEventsText}>No hay eventos</Text>
      )}
      <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('Formulario', { token, id_user })}>
        <Text style={styles.botonText}>+</Text>
      </TouchableOpacity>
      {username === "administrador@ad.com.ar" && (
        <>
              <View style={styles.separator}></View>
          <Text style={styles.tittulo}> Eventos Pasados...</Text>
          {arrayEvents_pasados.length > 0 ? (
            arrayEvents_pasados.map((evento, index) => (
              <View key={index} style={styles.cardPasado}>
                <Text style={styles.eventTextPasado}>{evento.name}</Text>
                <Text style={styles.dateText}>{evento.start_date.substring(0, 10)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noEventsText}>No hay eventos pasados</Text>
          )}
        </>
      )}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      
      <StatusBar style="auto" />
    </ScrollView>


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
            <Text style={styles.modalTitle}>Ups!   {errorMessage}</Text>
            <TouchableOpacity style={styles.button} onPress={closeModal}>
              <Text>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/*act admin - modal edit event*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible3}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Evento</Text>

            <TextInput
              style={styles.input}
              value={name}
              placeholder="Nombre"
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              value={description}
              placeholder="Descripción"
              onChangeText={setDescription}
            />
            <TextInput
              style={styles.input}
              value={startDate}
              placeholder="Fecha de Inicio"
              onChangeText={setStartDate}
            />
            <TextInput
              style={styles.input}
              value={duration_in_minutes}
              placeholder="Duración (minutos)"
              keyboardType="numeric"
              onChangeText={setDuration_in_minutes}
            />
            <TextInput
              style={styles.input}
              value={price}
              placeholder="Precio"
              keyboardType="numeric"
              onChangeText={setPrice}
            />
            <TextInput
              style={styles.input}
              value={max_assistance}
              placeholder="Máximo de Asistentes"
              keyboardType="numeric"
              onChangeText={setMax_assistance}
            />
            
            <TouchableOpacity style={styles.boton} onPress={editEvent}>
              <Text style={styles.botonText}>Guardar Cambios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boton} onPress={closeModal}>
              <Text style={styles.botonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* modal eliminaaaaaaaar :) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible4}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Eliminar</Text>

            <Text> ¿Estás seguro de eliminar este evento? </Text>
            
            <TouchableOpacity style={styles.boton} onPress={eliminarEvento}>
              <Text style={styles.botonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boton} onPress={closeModal}>
              <Text style={styles.botonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* modal detalle de evento */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible5}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Detalles de evento</Text>
            <Text style={styles.eventText}>{eventoActual.name}</Text>
            <Text style={styles.dateText}>{eventoActual.start_date}</Text>
            <Text style={styles.modalTitle}>Listado de inscriptos</Text>
            {persona_nombre.length > 0 ? (
              persona_nombre.map((persona, index) => (
                <View key={index} style={styles.card}>
                  <Text style={styles.eventText}> ID: {persona.id}</Text>
                  <Text>{`${persona.first_name} ${persona.last_name}`}</Text>
                </View>
              ))
            ) : (
              <Text>No hay personas inscriptas... todavía</Text>
            )}
          </View>
          <TouchableOpacity style={styles.boton} onPress={closeModal}>
            <Text style={styles.botonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  separator : {
    height: 1, 
    width: '200%', 
    backgroundColor: 'black', 
    marginVertical: 10,
    marginTop:100,
  },
  tittulo:{
    fontWeight: 'bold',
    fontSize: 25,
    color: 'grey',
    marginBottom: 15,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#ffd9df',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#333',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontWeight: 'bold',
    fontSize: 28,
    color: '#7f6065',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginVertical: 10,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPasado:{
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#e0e0e0', 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginVertical: 10,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  eventTextPasado: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999997', 
    marginBottom: 15,
  },
  dateText: {
    fontSize: 14,
    color: '#777',
  },
  noEventsText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
  boton: {
    cursor: 'pointer',
    padding: 10,
    backgroundColor: '#7f6065',
    borderRadius: 5,
    width: 120,
    alignItems: 'center',
    marginTop: 10,
  },
  botonText: {
    color: '#fff',
    fontSize: 18,
  },
  botonText2: {
    color: '#fff',
    fontSize: 14,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '80%',
    padding: 25,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#007bff',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 12,
    width: '100%',
  },
});
