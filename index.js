const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dhklnue.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const brandsCollection = client.db('carGarage').collection('brandsCollection');
        const individualBrandCollection = client.db('carGarage').collection('individualBrand');
        const bookingsCollection = client.db('carGarage').collection('bookings');

        app.get('/brandsCollection', async(req, res) =>{
            const query = {};
            const options = await brandsCollection.find(query).toArray();
            res.send(options);
        });

        app.get('/brandsCollection/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {brands_id: id};
            const options = await individualBrandCollection.find(query).toArray();
            res.send(options);
        });

        app.post('/bookings', async(req, res) =>{
            const booking = req.body
            console.log(booking);
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        })
    }
    finally{}
}
run().catch(console.dir)


app.get('/', async(req, res) =>{
    res.send('car garage server is running')
})

app.listen(port, () => console.log('car garage server is running on', port))