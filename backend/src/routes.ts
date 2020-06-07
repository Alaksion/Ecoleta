import express from 'express'
import multer from 'multer'
import multerconfig from './config/multer'

import PointController from './controllers/PointController'
import ItemController from './controllers/ItemController'
import {Joi, celebrate} from 'celebrate'

const router = express.Router()
const point_Controller = new PointController
const item_Controller = new ItemController
const upload = multer(multerconfig)


router.get('/items', item_Controller.index)
    
router.post('/points', upload.single('image'), celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().max(2).required(),
        items: Joi.string().required()
    })
}, {abortEarly: false}), point_Controller.create)

router.get('/points/:id', point_Controller.show )
router.get('/points/', point_Controller.index )


export default router