import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useState } from 'react';

export default function Formulario({ route }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [id_event_category, setId_event_category] = useState('');
  const [id_event_location, setId_event_location] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration_in_minutes, setDuration_in_minutes] = useState('');
  const [price, setPrice] = useState('');
  const [max_assistance, setMax_assistance] = useState('');
  const [enabled_enrollement, setEnabled_enrollement] = useState(true);
  const [id_creator_user, setId_creator_user] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const { response_1 } = route.params || {};

  const handleCreateEvent = async () => { 
    console.log("entró");
    console.log(name);
    try {
      const response_1 = await axios.post('http://172.24.208.1:3000/api/event', {
        name,
        description,
        id_event_category,
        id_event_location,
        start_date: startDate,
        duration_in_minutes,
        price,
        max_assistance,
        enabled_enrollement,
        id_creator_user
      });
      if (response_1.data.success) {
        Alert.alert('Success', 'Event created successfully');
        closeModal(); 
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Could not create event. Please try again.');
    }
  }

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {response_1}
      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ingrese su nombre"
      />
      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder=""
      />
      <Text style={styles.label}>Categoría:</Text>
      <TextInput
        style={styles.input}
        value={id_event_category}
        onChangeText={setId_event_category}
        placeholder=""
      />
      <Text style={styles.label}>Ubicación:</Text>
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
      <Text style={styles.label}>Duración:</Text>
      <TextInput
        style={styles.input}
        value={duration_in_minutes}
        onChangeText={setDuration_in_minutes}
        placeholder="Duración en minutos"
      />
      <Text style={styles.label}>Precio:</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder=""
      />
      <Text style={styles.label}>Máxima asistencia:</Text>
      <TextInput
        style={styles.input}
        value={max_assistance}
        onChangeText={setMax_assistance}
        placeholder=""
      />
      <TextInput
        style={styles.hiddenInput} 
        value={String(enabled_enrollement)} 
        onChangeText={setEnabled_enrollement}
        editable={false} 
      />
      <TextInput
        style={styles.hiddenInput}
        value={id_creator_user}
        onChangeText={setId_creator_user}
        editable={false} 
      />
      <Button title="Crear Evento" onPress={openModal} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirmar Evento</Text>
            <Text>Datos ingresados:</Text>
            <Text>Nombre: {name}</Text>
            <Text>Descripción: {description}</Text>
            <Text>Fecha de Inicio: {startDate}</Text>
            <Text>Duración: {duration_in_minutes}</Text>
            <Text>Precio: {price}</Text>
            <Text>Máxima asistencia: {max_assistance}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={closeModal}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleCreateEvent}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
