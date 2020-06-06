import connection from '../database/connection'
import {Request, Response} from 'express'

class PointController{
    async create(req: Request, res: Response){
        const data = req.body
        const trx = await connection.transaction()

        const insertedIds = await trx('points').insert({
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name: data.name,
            email: data.email,
            whatsapp: data.whatsapp,
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city,
            uf: data.uf
        })

        const id = insertedIds[0]
    
        const pointItems = await data.items.map( (item_id : number) =>{
            return {
                item_id,
                point_id : id
            }
        })

        await trx('point_items').insert(pointItems)

        const point = {
            id: id,
            ...data, 
        }
        trx.commit()

        return res.json(point)
    }

    async show(req: Request, res: Response){
        const point_id = req.params.id
        
        const point = await connection('points').select("*").where({id:point_id}).first()

        if(!point){
            return res.status(400).send({msg: "Point not found" })
        }

        const items = await connection('items')
            .join('point_items', 'items.id','=' ,'point_items.item_id')
            .where('point_items.point_id' , point_id).select(['items.name', ])

        return res.json({point, items})
    }

    async index(req: Request, res: Response){
        const {city, uf, items} = req.query

        const parsedItems = String(items).split(",").map(item=> Number(item.trim()))

        const points = await connection('points')
        .join('point_items', 'point_items.point_id', '=', 'points.id')
        .whereIn('point_items.item_id', parsedItems)
        .where('points.city', String(city))
        .where('points.uf', String(uf))
        .distinct()
        .select('points.*')

        return res.json(points)
    }
    

    
}

export default PointController