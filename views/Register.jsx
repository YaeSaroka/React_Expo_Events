import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert  } from "react-native";
import { useState } from 'react';
import axios from 'axios';

export default function Register({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://10.152.2.2:3000/api/user/register', {
        first_name: firstName,
        last_name: lastName,
        username,
        password,
      });

      if (response.data.success) {
        navigation.navigate('Login');
      } else {
        Alert.alert('Error de Registro', response.data.message || 'No se pudo completar el registro. Por favor, intente nuevamente.');
      }
    } catch (error) {
      Alert.alert('Error de Registro', error.response.data.message || 'No se pudo completar el registro. Por favor, intente nuevamente.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.boxh1}>REGISTER</Text>
        <TextInput
          style={styles.boxinput}
          placeholder="Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.boxinput}
          placeholder="Surname"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.boxinput}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.boxinput}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.boxbutton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <Text style={styles.boxp}>¿Ya tenés cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Iniciá Sesión</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  box: {
    width: '100%',
    maxWidth: 400,
    padding: 30,
    backgroundColor: '#7f6065',
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  boxh1: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center',
    color: "#fff",
  },
  boxinput: {
    width: '100%',
    padding: 15,
    backgroundColor: "#ffd9df",
    color: "#fff",
    borderRadius: 5,
    marginBottom: 15,
  },
  boxbutton: {
    width: '100%',
    padding: 15,
    backgroundColor: "#cc99a2",
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  boxp: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
  linkText: {
    color: "#cc99a2",
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    padding: 15,
    backgroundColor: "#742ecc",
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  }
});
