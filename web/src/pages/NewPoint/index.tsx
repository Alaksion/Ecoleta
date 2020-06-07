import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react'
import './styles.css'
import logo from '../../assets/logo.svg'
import {Link, useHistory} from 'react-router-dom'
import {FiArrowLeft} from 'react-icons/fi'
import {Map, TileLayer, Marker} from 'react-leaflet'
import api from '../../services/api'
import axios from 'axios'
import {LeafletMouseEvent} from 'leaflet'
import Dropzone from '../../components/dropzone/index'



const CreatePoint = ()=>{
    //sempre ao criar um array ou objeto em um estado deve ser criado um tipo de dado para o que for inserido
     const history = useHistory()

    interface Item{
        image_url:string,
        name: string,
        id: number
    }

    interface UFResponse{
        sigla: string
    }

    interface City{
        nome: string
    }

    const [items, setItems] = useState<Array<Item>>([])

    const [ufs, setUfs] = useState<Array<string>>([])
    const [selectedUf, setSelectedUf] = useState("0")

    const [cities, setCities] = useState<Array<string>>([])
    const [selectedcity, setSelectedCity] = useState("")

    const [selectedposition, setSelectedPosition] = useState<[number, number]>([0, 0])
    const [userPosition, setUserPosition] = useState<[number, number]>([0, 0])

    
    const [file, setFile] = useState<File>()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [whatsapp, setWhatsapp] = useState("")

    const[Selecteditems, setSelectedItems] = useState<Array<number>>([])

    async function handleSubmit(event: FormEvent){
        event.preventDefault()

        const uf = selectedUf
        const city = selectedcity
        const [latitude, longitude] = selectedposition
        const items = Selecteditems

        const data = new FormData()

        data.append('name', name) 
        data.append('email', email) 
        data.append('whatsapp', whatsapp) 
        data.append('uf', uf) 
        data.append('city', city) 
        data.append('latitude', String(latitude)) 
        data.append('longitude', String(longitude)) 
        data.append('items', items.join(',')) 
        if(file){
            data.append('image', file)
        }

        await api.post('http://localhost:8081/points', data)
        alert("Ponto de coleta criado com sucesso")
        history.push('/')
    }

    function handleEmail(event: ChangeEvent<HTMLInputElement>){
        let email = event.target.value
        setEmail(email)
        console.log(email)
    }

    function handleSelectItem(id:number){
        const isSelected = Selecteditems.findIndex(item => item ===id)
        
        if (isSelected >= 0){
            const filteredItems = Selecteditems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        }
        else{
            setSelectedItems([...Selecteditems, id])
        }
        
    }

    function HandleName(event: ChangeEvent<HTMLInputElement>){
        let name= event.target.value
        setName(name)
        console.log(name)
    }

    function HandleWhatsapp(event: ChangeEvent<HTMLInputElement>){
        let whatsapp = event.target.value
        setWhatsapp(whatsapp)
        console.log(whatsapp)
    }

    function HandleSelectedUf(event: ChangeEvent<HTMLSelectElement> ){
       let selected = event.target.value
       setSelectedUf(selected)
    }

    function HandleSelectedCity(event: ChangeEvent<HTMLSelectElement>){
        let selected = event.target.value
        setSelectedCity(selected)
        
    }

    function HandleMapClick(event: LeafletMouseEvent){
        const position = event.latlng
        setSelectedPosition([position.lat, position.lng])
        console.log(position)
    }

    // carregamento de items
    useEffect(()=>{
        api.get('items').then((res)=>{
            setItems(res.data)
        })

    }, [])

    // chamada de api dos estados
    useEffect(()=>{
       axios.get<Array<UFResponse>>("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then((res)=>{
           const ufInitials = res.data.map(uf => (uf.sigla))
           setUfs(ufInitials)
       })
    }, [])

    // chamada de api das cidades por estado
    useEffect(()=>{
        axios.get<Array<City>>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then((res=>{
            const cities = res.data.map(city => (city.nome))
            setCities(cities)
        }))

    }, [selectedUf])

    // pegando a posição do usuário
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(position=>{
            setUserPosition([position.coords.latitude, position.coords.longitude])
            setSelectedPosition(userPosition)
        })
    }, [])

    return(
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to='/'> <FiArrowLeft></FiArrowLeft> Página Principal</Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br></br> ponto de coleta</h1>
                <Dropzone onFileUpload={setFile} ></Dropzone>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Exemplo"
                            value={name}
                            onChange={HandleName}>
                        </input>
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text"
                                id="whatsapp"
                                name="whatsapp"
                                placeholder="51999999999"
                                value ={whatsapp}
                                onChange={HandleWhatsapp}>
                            </input>
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email"
                                id="email"
                                name="email"
                                placeholder="exemplo@exemplomail.com"
                                value={email}
                                onChange={handleEmail}>
                            </input>
                        </div>

                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o enderço no mapa</span>
                    </legend>
                    <Map center={userPosition} zoom={15} onclick={HandleMapClick}> 
                        <TileLayer 
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"> 
                        </TileLayer>
                        <Marker position={selectedposition}></Marker>
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select 
                                id="uf"
                                name="uf"
                                onChange={HandleSelectedUf}
                                value={selectedUf}>
                                    <option value={0}>Selecione um UF</option>

                                    {ufs.map(uf=>{
                                       return <option key={uf} value={uf}>{uf}</option>
                                    })
                                    }
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">cidade</label>
                            <select 
                                id="city"
                                name="city"
                                onChange={HandleSelectedCity}
                                value={selectedcity}>
                                    <option value={0}>Selecione uma cidade</option>

                                    {cities.map(city=>{
                                       return  <option key={city} value={city}>{city}</option>
                                    })}

                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Items de Coleta</h2>
                        <span>Selecione um ou mais items abaixo</span>
                    </legend>        

                    <ul className="items-grid">
                        {items.map(item=>{
                            return(
                                <li key={item.id} 
                                    onClick={() => handleSelectItem(item.id)} 
                                    className={ Selecteditems.includes(item.id)? "selected": ""}>
                                    <img src={item.image_url} alt={item.name}></img>
                                    <span>{item.name}</span>
                                </li>
                            )
                        })}
                    </ul>    
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>


           
        </div>
    )
}

export default CreatePoint