import express from 'express'
const app = express()
import router from './routes'
import path from 'path'
import cors from 'cors'

app.use(express.json())
app.use(router)
app.use(cors())

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads' )))

export default  app