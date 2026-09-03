import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaf7ed',
    },
    containerContent: {
        flexGrow: 1,
        padding: 24,
        paddingBottom: 48,
    },
    content: {
        width: '100%',
        maxWidth: 480,
        alignSelf: 'center',
        marginTop: -32,
        marginBottom: 32,
        transform: [{ scale: 0.8 }],
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: '#d0efd6',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 16,
    },
    badgeText: {
        color: '#216b36',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    text: {
        color: '#163b24',
        fontSize: 34,
        fontWeight: '800',
        marginBottom: 8,
    },
    subtitle: {
        color: '#52705a',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
    },
    searchCard: {
        backgroundColor: '#ffffff',
        borderColor: '#d5ead9',
        borderRadius: 16,
        borderWidth: 1,
        padding: 20,
        boxShadow: '0px 8px 18px rgba(29, 92, 49, 0.1)',
        elevation: 4,
    },
    label: {
        color: '#285b37',
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 8,
    },
    inputCep: {
        backgroundColor: '#f7fbf7',
        borderColor: '#b9d8bf',
        borderRadius: 10,
        borderWidth: 1,
        color: '#163b24',
        fontSize: 18,
        height: 52,
        paddingHorizontal: 14,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#2f8f46',
        borderRadius: 10,
        height: 52,
        justifyContent: 'center',
        marginTop: 14,
    },
    buttonPressed: {
        backgroundColor: '#247238',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    hint: {
        color: '#78917e',
        fontSize: 12,
        marginTop: 10,
        textAlign: 'center',
    },
    resultCard: {
        backgroundColor: '#216b36',
        borderRadius: 16,
        marginTop: 16,
        padding: 20,
    },
    resultTitle: {
        color: '#d9f2dd',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 14,
        textTransform: 'uppercase',
    },
    resultRow: {
        borderBottomColor: '#4b9560',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    resultLabel: {
        color: '#c4e8ca',
        fontSize: 14,
    },
    resultValue: {
        color: '#ffffff',
        flex: 1,
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 16,
        textAlign: 'right',
    },
});

export default function App() {

    const token = '28121|sMCEwZcrDnzgbxrn8j9NsPbIxWcFgMI1'
    const [cep, setCep] = useState('');
    const [end, setEnd] = useState(null);
    const [carregando, setCarregando] = useState(false);

    async function buscarCep() {
        const cepNumerico = cep.replace(/\D/g, '');

        if (cepNumerico.length !== 8) {
            Alert.alert('Atenção: CEP inválido!');
            return;
        }

        setCarregando(true);

        try {
            const resposta = await fetch(`https://api.invertexto.com/v1/cep/${cepNumerico}?token=${token}`);
            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.message || 'Não foi possível consultar o CEP.');
            }

            setEnd({
                rua: dados.street,
                bairro: dados.neighborhood,
                cidade: dados.city,
                estado: dados.state,
                cep: dados.cep
            });
        } catch (error) {
            Alert.alert('Erro', error.message || 'Não foi possível consultar o CEP.');
        } finally {
            setCarregando(false);
        }
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.containerContent}>
            <View style={styles.content}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Consulta rápida</Text>
                </View>

                <Text style={styles.text}>Encontre seu endereço.</Text>
                <Text style={styles.subtitle}>Digite um CEP para consultar rua, bairro, cidade e estado.</Text>

                <View style={styles.searchCard}>
                    <Text style={styles.label}>CEP</Text>
                    <TextInput
                        style={styles.inputCep}
                        placeholder='00000-000'
                        placeholderTextColor='#91aa97'
                        keyboardType='numeric'
                        maxLength={9}
                        value={cep}
                        onChangeText={(valor) => setCep(valor.replace(/[^0-9-]/g, '').slice(0, 9))}
                    />

                    <Pressable
                        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                        onPress={buscarCep}
                        disabled={carregando}
                    >
                        {carregando ? <ActivityIndicator color='#ffffff' /> : <Text style={styles.buttonText}>Buscar endereço</Text>}
                    </Pressable>
                    <Text style={styles.hint}>Consulta segura por CEP brasileiro</Text>
                </View>

                {end ?
                    <View style={styles.resultCard}>
                        <Text style={styles.resultTitle}>Endereço encontrado</Text>
                        <View style={styles.resultRow}><Text style={styles.resultLabel}>Rua</Text><Text style={styles.resultValue}>{end.rua}</Text></View>
                        <View style={styles.resultRow}><Text style={styles.resultLabel}>Bairro</Text><Text style={styles.resultValue}>{end.bairro}</Text></View>
                        <View style={styles.resultRow}><Text style={styles.resultLabel}>Cidade</Text><Text style={styles.resultValue}>{end.cidade}</Text></View>
                        <View style={styles.resultRow}><Text style={styles.resultLabel}>Estado</Text><Text style={styles.resultValue}>{end.estado}</Text></View>
                        <View style={styles.resultRow}><Text style={styles.resultLabel}>CEP</Text><Text style={styles.resultValue}>{end.cep}</Text></View>
                    </View>
                : null}
            </View>
        </ScrollView> 
     );
}