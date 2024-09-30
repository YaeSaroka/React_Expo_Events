import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert, Modal, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import RNPickerSelect from "react-native-picker-select";


export default function Formulario({ route }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [id_event_category, setId_event_category] = useState(0);       
  const [id_event_location, setId_event_location] = useState(0);       
  const [startDate, setStartDate] = useState('');
  const [duration_in_minutes, setDuration_in_minutes] = useState(0);
  const [price, setPrice] = useState(0);
  const [max_assistance, setMax_assistance] = useState(0);
  const [enabled_enrollement, setEnabled_enrollement] = useState(true);


  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [locations_, setLocations] = useState([]);
  const [categorias_, setCategorias] = useState([]);

  const { token, id_user } = route.params || {};
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  
  useEffect(() => {
    locations();
    categorias();
  }, []);

  const locations = async () => { 
    try {
      const response = await axios.get('http://172.22.112.1:3000/api/location', config);
      setLocations(response.data);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load locations');
    }
  };
  const locationItems = Array.isArray(locations_) ? locations_.map((location, index) => ({
    label: location.name, 
    value: location.id,
    key: `${location.id}-${index}`, 
  })) : [];

  const categorias = async () => { 
    try {
      const response = await axios.get('http://172.22.112.1:3000/api/event-category', config);
      setCategorias(response.data);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load locations');
    }
  };

  const categoriasItems = Array.isArray(categorias_) ? categorias_.map((categoria, index) => ({
    label: categoria.name, 
    value: categoria.id,
    key: `${categoria.id}-${index}`, 
  })) : [];



  const handleCreateEvent = async () => { 
    console.log("entró - ", enabled_enrollement);
    try {
      const response = await axios.post('http://172.22.112.1:3000/api/event', {
        name,
        description,
        id_event_category,
        id_event_location,
        start_date: startDate,
        duration_in_minutes,
        price,
        max_assistance,
        enabled_enrollement,
        id_creator_user: id_user 
      }, config);

  
      if (response.data == "Created. OK") {
        Alert.alert('Success', 'Event created successfully');
        console.log("success, evento cargadooooooo");
        closeModal(); 
        setTimeout(() => {
          openModal2();
        }, 100); 
      }
    } catch (error) {
      console.log("No funciona");
      Alert.alert('Error', error.response?.data?.message || 'No se pudo completar el formulario');
    }
  }

  const openModal = () => {
    setModalVisible(true);
  };
  const openModal2 = () => {
    setModalVisible2(true);
  }
  
  const closeModal = () => {
    setModalVisible(false);
    setModalVisible2(false);
  };

  return (
    <View style={styles.container}>
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
      <Text style={styles.label}>Categoria:</Text>
      <RNPickerSelect
        onValueChange={value => setId_event_category(value)}
        items={categoriasItems}
        placeholder={{ label: 'Seleccione una categoria...', value: null }}
      />

      
      <Text style={styles.label}>Ubicación:</Text>
      <RNPickerSelect
        onValueChange={value => setId_event_location(value)}
        items={locationItems}
        placeholder={{ label: 'Seleccione una ubicación...', value: null }}
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
            <Text>Categoría: {id_event_category}</Text>
            <Text>Ubicación: {id_event_location}</Text>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={closeModal} 
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Su evento se ha publicado correctamente</Text>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible2(false)}>
              <Text style={styles.buttonText}>Ok</Text>
            </TouchableOpacity>
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
