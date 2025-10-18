

// npx expo install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context
// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TelaDetalhes from "./screens/TelaDetalhes";
import TelaIBusca from "./screens/TelaIBusca";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Search">
        <Stack.Screen name="Search" component={TelaIBusca} options={{ title: "Buscar Filmes" }} />
        <Stack.Screen name="Details" component={TelaDetalhes} options={{ title: "Detalhes" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

