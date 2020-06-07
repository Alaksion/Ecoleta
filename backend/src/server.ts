import app from './app'

const port = 8081

app.listen(port, ()=> console.log("Servidor rodando na porta " + String(port)))