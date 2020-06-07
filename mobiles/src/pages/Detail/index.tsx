import React, { useEffect, useState } from "react"
import {View, Text, TouchableOpacity, Image, SafeAreaView, Linking} from 'react-native'
import {Feather, FontAwesome} from "@expo/vector-icons"
import styles from'./styles'
import {useNavigation, useRoute} from '@react-navigation/native'
import {RectButton} from 'react-native-gesture-handler'
import api from '../../services/api'
import * as MailComposer from 'expo-mail-composer'



export default function Detail(){

    interface Params{
        point_id: number
    }

   interface Data{
        serialiazedPoint: {
            image: string, 
            name: string, 
            whatsapp: string,
            email:string,
            city: string,
            uf: string,
            image_url: string,
        },
        items:{
            name: string,
        }[] // declarando um array de objetos
   }

    const navigation = useNavigation()
    const route = useRoute() // capturando os parametros da rota anterior
    const routeParams = route.params as Params // afirmando que os parametros da pagina anterior tem o formato especificado
    const [Data, SetData] = useState<Data>({} as Data)

    useEffect(()=> {
        const point_id = routeParams.point_id
        api.get(`/points/${point_id}`).then(point =>{
            console.log(point.data)
            SetData(point.data)
        })
    }, [])

    function handleNavigateBack(){
        navigation.goBack()
    }

    function handleMailComposer(){
        MailComposer.composeAsync({
            subject: "Interesse na coleta de resíduos",
            recipients: [Data.serialiazedPoint.email],
        })
    }

    function handleWhatsapp(){
        Linking.openURL(`whatsapp://send?phone=${Data.serialiazedPoint.whatsapp}&text= Olá! Tenho interesse em fazer descartes no seu ponto de coleta`)

    }

    if(!Data){
        return null
    }


    return(
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Feather name={"arrow-left"} size={20} color="#34cb79"></Feather>
                </TouchableOpacity>
                <Image style={styles.pointImage} source={{uri: Data.serialiazedPoint.image_url}}></Image>

                <Text style={styles.pointName}>{Data.serialiazedPoint.name}</Text>
                <Text style={styles.pointItems}>{Data.items.map(item=> item.name).join(", ") }</Text>

                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressContent}>{`${Data.serialiazedPoint.city}, ${Data.serialiazedPoint.uf}`}</Text>
                </View>
                
            </View>

            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhatsapp}>
                    <FontAwesome name="whatsapp" size={30} color="#fff"></FontAwesome>
                    <Text style={styles.buttonText}> Whatsapp</Text>
                </RectButton>

                <RectButton style={styles.button} onPress={handleMailComposer}>
                    <Feather name="mail" size={30} color="#fff"></Feather>
                    <Text style={styles.buttonText}> Email</Text>
                </RectButton>
                
            </View>
        </SafeAreaView>
    )

}