const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
    socket.on('connectRoom', box => {
        socket.join(box);
    })
})

mongoose.connect('mongodb+srv://felipe:felipe@cluster0-vgsrk.mongodb.net/felipe?retryWrites=true',
{
    useNewUrlParser : true //Informa ao mongoose que está usando um formato de url nova
});

app.use((req, res, next) => {
    req.io = io;
    return next();
});

// app.use >> registra um módulo dentro do express
app.use(express.json()); //Auxilia o servidor a interpretar as requisições que chegam em formato json
app.use(express.urlencoded({ extended: true })); //Permite enviar com arquivos dentro das requisições
app.use('/files', express.static(path.resolve(__dirname, "..", "tmp")));

app.use(require('./routes')) // Se não colocar o ./ interpreta que é alguma dependência da node modules.
                             // o ./ tbm informa que é a pasta atual. Está importando o arquivo na pasta atual.
                             
app.listen(process.env.PORT || 3333);