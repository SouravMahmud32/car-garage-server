const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require("jsonwebtoken");
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
        const usersCollection = client.db('carGarage').collection('users');
        const advirtiseProductsCollection = client.db('carGarage').collection('advirtiseProducts');

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

        app.get('/bookings', async(req, res) =>{
            const email = req.query.email;
            const query = {email: email};
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings);
        })

        app.post('/bookings', async(req, res) =>{
            const booking = req.body
            console.log(booking);
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        });

        app.get("/jwt", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
              const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
                expiresIn: "1h",
              });
              res.send({ accessToken: token });
            }
            // res.status(403).send({accessToken: ''})
          });

          app.get("/users", async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
          });

          app.get("/users/admin/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === "admin" });
          });
        
        app.post('/users', async(req, res) =>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result); 
        });

        app.post("/advirtise", verifyJWT, async (req, res) => {
            const product = req.body;
            const result = await advirtiseProductsCollection.insertOne(product);
            res.send(result);
          });

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.findOneAndDelete(query);
            console.log(result);
            res.send(result);
        });
    }
    finally{}
}
run().catch(console.dir)


app.get('/', async(req, res) =>{
    res.send('car garage server is running')
})

app.listen(port, () => console.log('car garage server is running on', port))