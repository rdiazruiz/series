require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var createHash = require('hash-generator');
var hashLength = 20;

var hash = createHash(20);
var low = require('lowdb');
var FileAsync = require('lowdb/adapters/FileAsync');

var adapter = new FileAsync('db.json');

// var createHash = require('hash-generator');
// var hashLength = 20;

var app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var server = app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`);
});


low(adapter)
    .then((db) => {
        //Listado de generos
        app.get('/api/genres', (req, res, next) => {
            const genre = db.get('genres')
                .value();
            res.status(200).send(genre);
        });
        // Listado de series
        app.get('/api/series', (req, res, next) => {
            const series = db.get('series')
                .value();
            res.status(200).send(series);
        });
        // Series por id
        app.get('/api/series/:id', (req, res, next) => {
            var serieId = req.params.id;
            var serie = db.get('series').find((id) => {
                return id.id == serieId;
            });
            res.status(200).send(serie);
        });
        // Filtro por titulo
        app.get('/api/search/:title', (req, res, next) => {
            var title = req.params.title;
            title = title.toLowerCase();
            const serie = db.get('series').filter(item => item.title.toLowerCase().includes(title)).value()
            res.status(200).send(serie)
        });


        function authorization(token) {
            if (!token) {
                return;
            } else {
                return db.get('users').find((item) => item.hash === token).value();
            }
        }

        // Registro de usuario
        app.post('/api/register', (req, res, next) => {
            var body = req.body;
            var validUser = db.get('users').filter(user=>{return user.email === body.email}).value();
            
            if(validUser.length > 0){
                res.status(400).send({message: 'user existent'});
            } else {
                var id = db.get('users').last().value().id + 1;

                var object = {
                    id: id,
                    firstName: body.firstName,
                    lastName: body.lastName,
                    password: body.password,
                    email: body.email,
                    tags: [],
                    avatar: 'https://api.adorable.io/avatars/285/a',
                    rol: '0'
                }

                var users = db.get('users').value();
                users.push(object);

                db.get('users').write(users).then(() => {
                    res.status(200).send({ message: 'Succesful, user registrared' });
                });
            }
        });

        //Obterner perfil de usuario
        app.get('/api/profile', (req, res, next) => {
            var token = req.headers.authorization;
            var userdb = authorization(token);

            if (!userdb) {
                res.status(404).send({ message: 'Denied permission' });
            } else {
                var user = {
                    firstName: userdb.firstName,
                    lastName: userdb.lastName,
                    username: userdb.username,
                    email: userdb.email,
                    avatar: userdb.avatar,
                    tags: userdb.tags
                };
                setTimeout(() => res.status(200).send(user), 100);
            }
        });

        // Inicio de sesion
        app.post('/api/session', (req, res, next) => {
            var hash = createHash(hashLength);
            var email = req.body.email;
            var password = req.body.password;
            var user = db.get('users').find(e => e.email === email).value();

            if (user) {
                db.get('users')
                    .find(user => user.password === password)
                    .set('hash', hash)
                    .write()
                    .then(user => {
                        if (user) {
                            res.status(200).send({ hash: user.hash });
                        } else {
                            res.status(404).send({ message: 'Incorrect password' });
                        }
                    });
            } else {
                res.status(404).send({ message: 'This username doesn\'t exist' });
            }
        });

        // Cerrar sesion
        app.delete('/api/session', (req, res, next) => {
            var user = db.get('users').find((item) => item.hash === req.headers.authorization).value();
            if (user) {
                console.log('Hay user')
                db.get('users').find(userdb => userdb === user).unset('hash').write();
                res.status(200).send({ message: 'Close correct session' })
            } else {
                console.log('No hay user')
                res.status(404).send({ message: 'No user' });
            }
        });

        // Comentarios
        app.post('/api/comment', (req, res, next) => {
            var token = req.headers.authorization;
            var userdb = authorization(token);
            var comment = req.body.comment;
            var idSerie = req.body.idSerie;

            if (!userdb) {
                res.status(404).send({ message: 'Denied permission' });
            } else {
                var user = {
                    firstName: userdb.firstName,
                    lastName: userdb.lastName,
                    email: userdb.email,
                    avatar: userdb.avatar,
                    rol: userdb.rol
                };

                var d = new Date();
                var date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;


                var object = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatar: user.avatar,
                    date: date,
                    rate: 4,
                    comment: comment
                }
                var serie = db.get('series')
                    .find(serie => serie.id === parseInt(idSerie)).value();

                serie['comments'].push(object);

                db.get('series').find(s => s.id === parseInt(idSerie)).write(serie).then(() => {
                    res.status(200).send({ message: 'Succesful' });
                });

            }
        });
    });
