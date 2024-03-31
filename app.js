var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const {response} = require("express");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//-------------------SWAGGER
var swaggerUi = require('swagger-ui-express');
var YAML = require('yamljs');
var swaggerDocument = YAML.load('./api_doc.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const apiSpec = YAML.load(path.join(__dirname, 'api_doc.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec));
//--------------------------------

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./Proyecto"
    },
    useNullAsDefault: true
});



//-------------API---- ORDENADO POR LAS SIGLAS (CRUD) CREATE, READ, UPDATE y DELETE

app.get('/api/coches', async (req, res) => {
    try {
        const coches = await knex('coches')
        res.status(200).send(coches)
    } catch (e) {
        console.log(e)
        res.status(500).send('ERROR')
    }
});

app.get('/api/marcas', async (req, res) => {
    try {
        const marcas = await knex('marcas')
        res.status(200).send(marcas)
    } catch (e) {
        console.log(e)
        res.status(500).send('ERROR')
    }
});

app.get('/api/marcas/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const marca = await knex('marcas')
            .where('marcas.id', '=', id)
        res.status(200).send(marca)
    } catch (e) {
        console.log(e)
        res.status(500).send('ERROR')
    }
});

app.get('/api/coches/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const coche = await knex('coches')
            .where('coches.id', '=', id)
        res.status(200).send(coche)
    } catch (e) {
        console.log(e)
        res.status(500).send('ERROR')
    }
});


app.post('/api/coches/:id', async (req, res) => {
    let id = parseInt(req.params.id)
    const {nombre, fundacion, fundador, tipo, imagen} = req.body;

    try {
        const marca = await knex('marcas').where({id}).first()
        if (!marca) {
            res.status(404).send('not found')
        }
        const updateCount = await knex('marcas')
            .where({id})
            .update('marcas.id', nombre, fundacion, fundador, tipo, imagen)

        if (updateCount) {
            res.status(201).send("Ok!")
        } else {
            res.status(404).send({success: false, msg: 'Not found.'});
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({success: false, msg: e.message});
    }
});


app.post('/api/marcas/:id', async (req, res) => {
    let id = parseInt(req.params.id)
    const {nombre, fundacion, fundador, tipo, imagen} = req.body;

    try {
        const marca = await knex('marcas').where({id}).first()
        if (!marca) {
            res.status(404).send('not found')
        }
        const updateCount = await knex('marcas')
            .where({id})
            .update('marcas.id', {nombre, fundacion, fundador, tipo, imagen})

        if (updateCount) {
            res.status(204).send("Update of "+ {id} +" in table Marcas is Ok!")
        } else {
            res.status(404).send({success: false, msg: 'Not found.'});
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({success: false, msg: e.message});
    }
});

app.post('/api/marcas/:id', async (req, res) => {
    let id = parseInt(req.params.id)
    const {marca, modelo, version, año, combustible, imagen} = req.body;
    try {
        const coche = await knex('coches').where({id}).first()
        if (!coche) {
            res.status(404).send('not found')
        }
        const updateCount = await knex('coches')
            .where({id})
            .update('coches.id', {marca, modelo, version, año, combustible, imagen})
        if (updateCount) {
            res.status(204).send("Update of "+ {id} +" in table Coches is Ok!")
        } else {
            res.status(404).send({success: false, msg: 'Not found.'});
        }

    } catch (e) {
        console.log(e)
        res.status(500).send({success: false, msg: e.message});
    }
});


app.delete('/api/coches/:id',async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await knex('coches')
            .where({id})
            .delete()
        if (result) {
            res.send("Delete of "+ {id} +" in table Coches is Ok!")
        } else {
            res.status(404).send({success: false, msg: 'Not found.'});
        }
    } catch (e) {
        console.log(e)
        res.status(500).send('ERROR' + e.message)
    }
});

app.delete('/api/marcas/:id',async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await knex('marcas')
            .where({id})
            .delete()
        if (result) {
            res.send("Delete of "+ {id} +" in table Marcas is Ok!")
        } else {
            res.status(404).send({success: false, msg: 'Not found.'});
        }
    } catch (e) {
        console.log(e)
        res.status(500).send('ERROR' + e.message)
    }
});


//---------WEB----- ORDENADO POR LAS SIGLAS (CRUD) CREATE, READ, UPDATE y DELETE

app.get('/coches/new', async (req, res) => {
    try {
        const marcas = await knex('marcas')
        res.status(200)
        const options = {
            title: 'AÑADE UN COCHE NUEVO',
            marcas: marcas
        }
        res.render('add_coche', options)
    } catch (e) {
        console.log(e)
        res.status(500).send({success: false, msg: e.message})
    }
});

app.post('/coches/add', async (req, res) => {
    const {marca, modelo, version, año, combustible, imagen} = req.body;

    try {
        const addCount = await knex('coches')
            .insert({marca, modelo, version, año, combustible, imagen})
        if (addCount) {
            res.status(201).redirect('/coches')
        } else {
            res.status(404).send({success: false, msg: 'not found.'});
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({success: false, msg: e.message})
    }
});


app.get('/marcas/new', async (req, res) => {
    try {
        res.status(200)
        const options = {
            title: 'AÑADE UN COCHE NUEVO',
        }
        res.render('add_marca', options)
    } catch (e) {
        console.log(e)
        res.status(500).send({success: false, msg: e.message})
    }
});

app.post('/marcas/add', async (req, res) => {
    const {nombre, fundacion, fundador, tipo, imagen} = req.body;

    try {
        const addCount = await knex('marcas')
            .insert({nombre, fundacion, fundador, tipo, imagen})
        if (addCount) {
            res.status(201).redirect('/marcas')
        } else {
            res.status(404).send({success: false, msg: 'not found.'});
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({success: false, msg: e.message})
    }
});


app.get('/coches', async (req, res) => {

    try {
        const coches = await knex('coches as c')
            .join('marcas as m', 'c.marca', '=', 'm.id')
            .select('c.id', 'm.nombre as marca', 'c.modelo', 'c.version', 'c.año', 'c.combustible', 'c.imagen')
        const options = {
            title: 'Lista de coches',
            coches: coches
        }
        res.render('coches', options)
    } catch (e) {
        console.log(e)
        res.status(500).send('ERROR')
    }
});

app.get('/marcas', async (req, res) => {
    try {
        const marcas = await knex('marcas as m')
            .select('m.id', 'm.nombre', 'm.fundacion', 'm.fundador', 'm.tipo', 'm.imagen')
        const options = {
            title: 'Lista de Marcas',
            marcas: marcas
        }
        res.render('marcas', options)
    } catch (e) {
        console.log(e)
        res.status(500).send({msg: 'ERROR'})
    }
});

app.get('/marcas/update/:id', async (req, res) => {

    try {
        const id = req.params.id;
        const marca = await knex('marcas as m')
            .select('m.id', 'm.nombre', 'm.fundacion', 'm.fundador', 'm.tipo', 'm.imagen')
            .where('id', '=', id)

        const coches = await knex('coches')
        const options = {
            title: 'MODIFICANDO',
            marca: marca[0],
            coches: coches
        }
        res.render('update_marca', options)
    } catch (e) {
        console.log(e)
        res.status(500).send('ERROR ' + e)
    }
});


app.post('/marcas/update', async (req, res) => {
    const {id, nombre, fundacion, fundador, tipo, imagen} = req.body;

    try {
        const marca = await knex('marcas').where({id}).first()
        if (!marca) {
            res.status(404).send('not found')
        }
        const updateCount = await knex('marcas')
            .update({id, nombre, fundacion, fundador, tipo, imagen})
            .where({id})
        if (updateCount) {
            res.status(201).redirect('/marcas')
        } else {
            res.status(404).send({success: false, msg: 'not found.'});
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({success: false, msg: e.message});
    }
});

app.get('/coches/update/:id', async (req, res) => {

    try {
        const id = req.params.id;
        const coche = await knex('coches as c')
            .join('marcas as m', 'c.id', '=', 'm.id')
            .select('c.id', 'm.nombre as marca', 'c.modelo', 'c.version', 'c.año', 'c.combustible', 'c.imagen')
            .where('c.id', '=', id)

        const marcas = await knex('marcas')
        const options = {
            title: 'MODIFICANDO',
            coche: coche[0],
            marcas: marcas
        }
        res.render('update_coche', options)
    } catch (e) {
        console.log(e)
        res.status(500).send('ERROR ' + e)
    }
});


app.post('/coches/update', async (req, res) => {
    const {id, marca, modelo, version, año, combustible, imagen} = req.body;
    try {
        const coche = await knex('coches').where({id}).first()
        if (!coche) {
            res.status(404).send('not found')
        }
        const updateCount = await knex('coches')
            .update({id, marca, modelo, version, año, combustible, imagen})
            .where({id})
        if (updateCount) {
            res.status(201).redirect('/coches')
        } else {
            res.status(404).send({success: false, msg: 'not found.'});
        }

    } catch (e) {
        console.log(e)
        res.status(500).send({success: false, msg: e.message});
    }
});


app.delete('/coches/:id', async (req, res) => {

    const id = parseInt(req.params.id);
    try {
        // DELETE FROM 'Groups' WHERE id = id
        const result = await knex('coches')
            .where({id})
            .delete()
        if (result) {
            res.redirect('/coches')
        } else {
            res.status(404).send({success: false, msg: 'Not found.'});
        }
    } catch (e) {
        console.log(e)
        res.status(500).send('ERROR' + e.message)
    }
});


app.delete('/marcas/:id', async (req, res) => {

    const id = parseInt(req.params.id);
    try {
        const marcas = await knex('marcas').where({id})
        if (!marcas) {
            res.status(404).send(' marcas not found')
        }
        const result = await knex('marcas')
            .where({id})
            .delete()

        if (result) {
            console.log('marca borrada')
            res.redirect('/marcas')
        } else {
            console.log('no se encontró marca')
            res.status(404).send({success: false, message: 'marca not found.'});
        }
    } catch (e) {
        console.log(e)
        res.status(500).send('ERROR' + e.message)
    }
});



app.post('/contactos', async (req, res) => {
    const {nombre, email, telefono, mensaje} = req.body;
    try {
        const addContact = await knex('contactos')
            .insert({nombre, email, telefono, mensaje})
        if (addContact) {
            res.status(201).redirect('/')
        } else {
            res.status(404).send({success: false, msg: 'not found.'});
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({success: false, msg: e.message})
    }
});

// ==>  WEB  - Las rutas en Web son continuas a la IP y Puerto ('localhost:300/items...')

app.get('/about', (req, res) => {
    res.status(200)
    res.render('about', {
        title: 'ABOUT'
    })
});

app.get('/contactanos', (req, res) => {
    res.status(200)
    res.render('contactanos', {
        title: 'CONTACTANOS'
    })
});


app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
