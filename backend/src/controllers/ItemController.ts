import {Request, Response} from 'express'
import connection from '../database/connection'


class itemController {
    async index(req:Request, res:Response){
        const items = await connection('items').select('*')
        const serializedItems = items.map(item=> {
            return {
                name: item.name,
                image_url: `http://192.168.0.13:8081/uploads/${item.image}`,
                id: item.id
            }
        })
        return res.json(serializedItems)
    }
}

export default itemController