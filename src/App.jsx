import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#c0ffba',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    inputCep: {
        width: 200,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        paddingHorizontal: 10,
    },
    button: {
        marginTop: 100,
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
});

export default function App() {

    const token = '28121|sMCEwZcrDnzgbxrn8j9NsPbIxWcFgMI1'
    const [cep, setCep] = useState(''); 

    async function buscarCep() {
        if (cep.length == 0 || cep.length != 8) {
            Alert.alert('Atenção: CEP inválido!');
        }

        const resposta = await fetch(`https://api.invertexto.com/v1/cep/${cep}?token=${token}`)
    
        const dados = await resposta.json();
}

    return (
        <View style={styles.container}>

            <Text style={styles.text}>Bem-vindo!</Text>

            <TextInput 
                style={styles.inputCep}
                placeholder='Digite o CEP'
                keyboardType='numeric'
                value={cep}
                onChangeText={setCep}
             />

            <Button title="Buscar CEP" style={styles.button} onPress={buscarCep} />
        </View> 
     );
}