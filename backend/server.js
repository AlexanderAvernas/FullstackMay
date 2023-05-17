import { config } from 'dotenv'
import pkg from 'pg'
const { Client } = pkg

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
config()

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        exdended: true
    })
)

app.use(cors())
app.use(express.json())
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

const client = new Client({

    database: process.env.DATABASE,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    user: process.env.USER

    })

    client.connect(function (err) {
        if (err) throw err
        console.log('Database Connected')
        })

        app.get('/', (req, res) => {
            res.json('hejsan')
        })

        app.get('/persons', async (req, res) => {
            try {
                const result = await client.query('SELECT * FROM persons');
                res.json(result.rows)
            } catch (err) {
                console.roor(err)
                res.sendStatus(500)
            }
        });

        app.post('/persons/form', async (req, res) => {
            const {FirstName, LastName, Address, City} = req.body;
            try {
                await client.query(
                    'INSERT INTO persons (FirstName, LastName, Address, City) VALUES ($1, $2, $3, $4)',
                    [FirstName, LastName, Address, City]
                )
                res.sendStatus(200)
            } catch (err) {
                console.error(err)
                res.sendStatus(500)
            };
        })

        app.delete('/persons/:id', async (req, res) => {
            try {
            const id = req.params.id
            const deletePerson = await client.query('DELETE FROM persons WHERE id = $1', [
                id
            ])
            res.json({messega:'person deleted'})
        } catch (err) {
            console.log(err.message);
        }
        })

        app.put('/persons/:id', async (req, res) => {
            const id = req.params.id
            const { FirstName, LastName, Address, City } = req.body
            const values = [FirstName, LastName, Address, City, id]
            await client.query(
                'UPDATE persons SET FirstName = $1, LastName = $2, Address = $3, City = $4 WHERE id = $5',
                values
            )
            res.send('Person is changed')

        })



        app.listen(8900, () => { console.log('Server is running') })
