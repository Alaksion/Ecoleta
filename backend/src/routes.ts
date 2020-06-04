import express from 'express'
const router = express.Router()

import PointController from './controllers/PointController'
import ItemController from './controllers/ItemController'

const point_Controller = new PointController
const item_Controller = new ItemController


router.get('/items', item_Controller.index)
    
router.post('/points', point_Controller.create)
router.get('/points/:id', point_Controller.show )
router.get('/points/', point_Controller.index )


export default router