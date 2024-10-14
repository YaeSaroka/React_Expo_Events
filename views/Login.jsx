import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert  } from "react-native";
import axios from 'axios';
import { useState } from 'react';

export default function Login({ navigation }) {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://10.144.1.38:3000/api/user/login', {username,password});
      if (response.data.success) {
        console.log(response.data, "data");
        var token = response.data.result.token;
        var id_user = response.data.result.payload.id;
        navigation.navigate('Home', {token, id_user});
      }
    } catch (error) {
      Alert.alert('Error de Login', error.response.data.message || 'No se pudo iniciar sesión. Por favor, intente nuevamente.');
    }
    }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.boxh1}>LOGIN</Text>
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
        <TouchableOpacity style={styles.boxbutton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.boxp}>¿No tenés cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Registrarte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',},
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
