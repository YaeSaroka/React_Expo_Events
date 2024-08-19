import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from '../views/Login.jsx';
import Register from '../views/Register.jsx';
import Home from '../views/Home.jsx';

const LoginNavigation = () => {
    const LoginStack = createNativeStackNavigator()

    return (
        <LoginStack.Navigator>
            <LoginStack.Screen name= "Login" component={Login}></LoginStack.Screen>
            <LoginStack.Screen name= "Register" component={Register}></LoginStack.Screen>
            <LoginStack.Screen name= "Home" component={Home}></LoginStack.Screen>
        </LoginStack.Navigator>
    );
}

export default LoginNavigation;