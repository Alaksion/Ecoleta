import React, { useEffect, useState, ChangeEvent } from "react"
import {View, ImageBackground,  Text, Image, KeyboardAvoidingView, Platform, StyleSheet} from 'react-native'
import styles from './styles'
import {RectButton, TextInput} from 'react-native-gesture-handler'
import {Feather} from "@expo/vector-icons"
import {useNavigation, useRoute} from "@react-navigation/native"
import axios from 'axios'
import RNPickerSelect  from 'react-native-picker-select'


const Home = ()=>{

    const pickerSelectStyles = StyleSheet.create({
        inputIOS: {
          fontSize: 16,
          paddingVertical: 12,
          paddingHorizontal: 10,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 4,
          color: 'black',
          paddingRight: 30, // to ensure the text is never behind the icon
        },
        inputAndroid: {
          fontSize: 16,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderWidth: 0.5,
          borderColor: 'purple',
          borderRadius: 8,
          color: 'black',
          paddingRight: 30, // to ensure the text is never behind the icon
        },
      });
    

    interface UFResponse{
        sigla :string,
    }

    interface CityResponse{
        nome: string,
    }

    const navigation = useNavigation()
    const [ufs, setUfs] = useState<Array<string>>([])
    const [cities, setCities] = useState<Array<string>>([])
    const [selectedUf, setSelectedUf] = useState("")
    const [selectedCity, setSelectedCity] = useState("")

    function HandleNavigateToPoint(){
        navigation.navigate('Points', {city: selectedCity, uf: selectedUf})
    }

    function handleSelectUf(value: ChangeEvent<Element>){
        const uf = value
        setSelectedUf(String(uf))

    }

    function handleSelectCity(value : ChangeEvent<Element>){
        const city = String(value)
        setSelectedCity(city)
    }

    useEffect(()=>{
        axios.get<Array<UFResponse>>("https://servicodados.ibge.gov.br/api/v1/localidades/estados?Orderby=nome").then((res)=>{
            const ufInitials = res.data.map(uf => (uf.sigla))
            setUfs(ufInitials)
        })
     }, [])

     useEffect(()=>{
        axios.get<Array<CityResponse>>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then((res=>{
            const cities = res.data.map(city => (city.nome))
            setCities(cities)
        })) 
    }, [selectedUf])
    
    return(
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS == "ios" ? "padding" : undefined }> 
            <ImageBackground 
                style={styles.container} 
                source={require('../../assets/home-background.png')}
                imageStyle={{width:274, height:368}}>

                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')}></Image>
                    <View>
                        <Text style={styles.title}>Seu marketPlace de coleta de resíduos</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
                    </View>
                    

                </View>
                <View style={styles.footer}>

                <RNPickerSelect
                    value={selectedUf}
                    onValueChange={handleSelectUf}
                    placeholder={{label: 'Selecione o estado',}}
                    items={ufs.map(uf => {
                    return (
                        { label: uf, value: uf, color: '#5e5e63' }
                    );
                    })}
                    style={pickerSelectStyles}
                />

                
                <RNPickerSelect
                    value={selectedCity}
                    onValueChange={handleSelectCity}
                    placeholder={{label: 'Selecione o estado',}}
                    items={cities.map(city => {
                    return (
                        { label: city, value: city, color: '#5e5e63' }
                    );
                    })}
                    style={pickerSelectStyles}
                />

                    <RectButton style={styles.button} onPress={HandleNavigateToPoint} enabled={true}>
                        <View style={styles.buttonIcon}>
                            <Text> <Feather name="arrow-right" color="#fff" size={24}></Feather> </Text>
                        </View>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </RectButton>

                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}


export default Home