import express from 'express'
const app = express()

app.get('/teste', (req, res)=>{
    res.json({msg:'Bom dia primo 2'}).send()
})

module.exports = app