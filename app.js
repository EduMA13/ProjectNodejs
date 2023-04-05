const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const hbs = require('express-hbs');
const tailwindcss = require('tailwindcss');
const postcss = require('postcss');
const session = require('express-session');

const app = express();
const saltRounds = 10; 

//Random
const tailwindConfig = require('./tailwind.config.js');
const compiledStyles = postcss([tailwindcss(tailwindConfig)]).process('@tailwind base; @tailwind components; @tailwind utilities;').css;
app.use(express.static(__dirname + '/public'));


//Sesiones
app.use(session({
  secret: 'olacola',
  resave: false,
  saveUninitialized: false
}));


//Conexión de base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'users_db'
});


//Cargar la hoja de estilos en formato text/css
app.get('/public/css/output.css', (req, res) => {
  res.type('text/css');
  res.sendFile(__dirname + '/public/css/output.css');
});

//Utilizar hbs como engine
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));

//Main page
//app.get('/', (req, res) => {
//  res.send('login');
//});

//Register
app.get('/register', (req, res) => {
    res.render('register');
  });
  
  app.post('/register', (req, res) => {
    const { username, password, confirmpswd, vip} = req.body;
  
    // Verificar que las contraseñas sean iguales
    if (password !== confirmpswd) {
      res.status(400).send('Las contraseñas no coinciden');
      return;
    }
  
    // Encriptar la contraseña
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) throw err;
  
      // Insertar los datos en la base de datos
      connection.query('INSERT INTO users (username, password,vip) VALUES (?, ?, ?)', [username, hash,vip], (err, result) => {
        if (err) throw err;
  
        // Redireccionar al usuario a la página de login
        res.redirect('/');
      });
    });
  });
  
  
//Login
app.get('/', (req, res) => {
    res.render('login');
  });

app.get('/Mainpage', (req, res) => {
    res.render('Mainpage');
  });
  
  app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    connection.query('SELECT * FROM users WHERE username = ?', [email], (error, results, fields) => {
      if (error) throw error;
    
      if (results.length > 0) {
        const user = results[0];
    
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err;
    
          if (result) {
            req.session.user = {
              username: results[0].username,
              vip: results[0].vip
              
            };
            res.redirect('/Mainpage');
            
          } else {
            res.render('login', { message: 'Credenciales incorrectas' });
          }
        });
      } else {
        res.render('login', { message: 'Credenciales incorrectas' });
      }
    });

  });

  // Middleware para verificar si el usuario es VIP
const requireVIP = (req, res, next) => {
  if (req.session.user && req.session.user.vip) {
    next();
  } else {
    res.redirect('/Mainpage')
  }
};
// Ruta para la sección VIP
app.get('/VIP', requireVIP, (req, res) => {
  res.render('VIP')
});

  app.get('/partyroom', (req, res) => {
    res.render('partyroom');
  });

  app.get('/Gallery', (req, res) => {
    res.render('Gallery');
  });

  
  
//Comprobar si hay conexión en local host
app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
