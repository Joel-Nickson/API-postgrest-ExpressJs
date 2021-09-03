const express = require('express');
var cors = require('cors');
const app = express();
const dotenv = require("dotenv");
const { Pool } = require('pg');

dotenv.config({ path: ".env" });
const url = process.env.DATABASE_URL
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

let query = 'SELECT * FROM usertable;';
const pool = new Pool({connectionString:url, ssl:true})

async function getAllUsers(query) {
    let response;
    try {
        response = await pool.query(query);
    } catch (error) {
        throw error;
    }
    return response.rows;
}

async function setUsers(query) {
    let response;
    try {
        await pool.query(query);
    } catch (error) {
        throw error;
    }
}

app.get('/', async (req, res) => {
    res.status(200).send(`
    <ul>
    <li><span>get '/api'</span></li>
    <li><span>get '/api/[id]'</span></li>
    <li><span>post '/api'</span></li>
    <li><span>put '/api/[id]'</span></li>
    <li><span>delete '/api/[id]'</span></li>
    </ul>`
    );
});

app.get('/api', async (req, res) => {
    query = 'SELECT * FROM usertable;';
    const users = await getAllUsers(query);
    // console.log(users); // returns all users fine
    res.status(200).send(users);
});

app.get('/api/:id', async (req, res) => {
    const id = req.params.id;
    query = `SELECT * FROM usertable WHERE id=${id};`;
    const users = await getAllUsers(query);
    // console.log(users); // returns all users fine
    res.status(200).send(users);
});

app.post('/api', async (req, res) => {
    const {name, pass} = req.body;

    query = `INSERT INTO usertable(name, pass) VALUES( '${name}', '${pass}' );`
    await setUsers(query);
    res.sendStatus(200)

});

// app.post('/api/bulk', async (req, res) => {
//     const {name, pass} = req.body;

//     query = `INSERT INTO usertable(name, pass) VALUES( '${name}', '${pass}' )`
//     await pool.query(query);
//     res.sendStatus(200)

// });


app.put('/api/:id', async (req, res) => {
    const id = req.params.id;
    const {name, pass} = req.body;

    query = `UPDATE usertable 
            SET name='${name}',pass='${pass}' 
            WHERE id=${id};`
    await setUsers(query);
    res.sendStatus(200)

});

// app.patch('/api/:id', async (req, res) => {
//     const id = req.params.id;
//     const {name, pass} = req.body;

//     query = `UPDATE usertable 
//             SET name='${name}',pass='${pass}' 
//             WHERE id=${id};`
//     await pool.query(query);
//     res.sendStatus(200)

// });


app.delete('/api/:id', async (req, res) => {
    const id = req.params.id;
    
    query = `DELETE FROM usertable WHERE id = ${id};`
    await setUsers(query);
    res.sendStatus(200)

});


app.listen(PORT, () => {
  console.log(`Listening on  http://localhost:${PORT}`);
});