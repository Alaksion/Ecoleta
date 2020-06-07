import React, {useState, useEffect} from "react"
import {View, Text, TouchableOpacity, ScrollView, Image, Alert} from 'react-native'
import styles from './styles'
import {Feather} from '@expo/vector-icons'
import {useNavigation, useRoute} from '@react-navigation/native'
import Mapview, {Marker} from 'react-native-maps'
import {SvgUri} from 'react-native-svg'
import api from '../../services/api'
import * as Location from 'expo-location'

export default function Points(){

    interface Params{
        city:string,
        uf: string
    }

    interface Points{
        id : number,
        name: string,
        longitude : number,
        latitude : number,
        image: string,
        image_url: string,
    }

    interface Items{
        name: string,
        image_url: string,
        id: number
    }

    const route= useRoute()
    const routeParams = route.params as Params

    const navigation = useNavigation()
    const [items, setItems] = useState<Array<Items>>([])
    const [selectedItems, setSelectedItems] = useState<Array<number>>([])
    const [initalPosition, setInitialPosition] = useState<[number, number]>([0,0])
    const [points, setPoints] = useState<Array<Points>>([])

    function handleSelectedItems(id:number){
        const selected = selectedItems.findIndex(item => item === id)

        if(selected >= 0){
           const filteredItems = selectedItems.filter(item=> item !== id )
           setSelectedItems(filteredItems)
        }
        else{
            setSelectedItems([...selectedItems, id])
        }
    }

    function handleNavigation_Home(){
        navigation.navigate('Home')
    }

    function HandleNavigation_Detail(id:number){
        navigation.navigate('Detail', {point_id:id})
    }

    useEffect(()=>{
        api.get('/points', {
            params: {
                city: routeParams.city,
                uf: routeParams.uf,
                items: selectedItems
            }}).then(res=>{
                 setPoints(res.data)
            })
    }, [selectedItems])
    

    useEffect(()=>{
        async function loadPosition(){
            const {status} = await Location.requestPermissionsAsync()

            if (status !== "granted"){
                Alert.alert("Whoops", "precisamos de sua permissão para obter sua localização")
                return
            }

            const location = await Location.getCurrentPositionAsync()
            const {latitude, longitude} = location.coords
            setInitialPosition([latitude, longitude])
        }
        loadPosition()
    }, [])

    useEffect(()=>{
        api.get('/items').then(res=>{
            setItems(res.data)
        })
    }, [])

    
   

    return(
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigation_Home}>
                    <Feather name="arrow-left" size={20} color="#34cb79"></Feather>
                </TouchableOpacity>

                <Text style={styles.title}>Bem vindo</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta</Text>

            {initalPosition[0] !== 0 && (  <View style={styles.mapContainer}>
                    <Mapview
                        style={styles.map} 
                        initialRegion={{
                            longitude: initalPosition[1],
                            latitude: initalPosition[0],
                            latitudeDelta: 0.014,
                            longitudeDelta: 0.014,
                        }}
                        loadingEnabled={initalPosition[0] === 0}>
                            {
                                points.map(point =>(
                                        <Marker
                                        coordinate={{
                                            longitude: point.longitude,
                                            latitude: point.latitude
                                        }}
                                        onPress={() => (HandleNavigation_Detail(point.id))}
                                        key={String(point.id)}>
                                            <View style={styles.mapMarkerContainer}>
                                                <Image style={styles.mapMarkerImage} source={{uri: point.image_url}}></Image>
                                                <Text style={styles.mapMarkerTitle}> {point.name}</Text>
                                            </View>
                                    </Marker>
                                ))
                            }
                    </Mapview>
                </View>) }

            </View>
            <View style={styles.itemsContainer}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal: 20}}>

                    {items.map(item=>(
                        <TouchableOpacity 
                        activeOpacity={0.5} 
                        style={[styles.item,  selectedItems.includes(item.id) ? styles.selectedItem : {} ]} 
                        key={String(item.id)} 
                        onPress={() => handleSelectedItems(item.id)}>
                            <SvgUri width={42} height={42} uri={item.image_url}></SvgUri>
                            <Text style={styles.itemTitle}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>
    )

}