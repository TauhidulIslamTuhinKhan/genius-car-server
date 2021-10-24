const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const cors = require('cors');


const app = express();
const port = 5000;



// Middleware
app.use(cors());
app.use(express.json());








const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.toook.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
    //   console.log('connected to database');
      const database = client.db("carMechanic");
      const servicesCollection = database.collection("services");

      // Get API
      app.get('/services', async (req, res) => {
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
      })

      // Get single service
      app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const service = await servicesCollection.findOne(query);
        res.json(service);
      })

    //   POST API
        app.post('/services', async (req, res) => {
          const service = req.body;
          console.log('hit the API', service);
            const result = await servicesCollection.insertOne(service);
            // console.log(result);
            res.json(result);

        })

        // Delete API
        app.delete('/services/:id', async (req, res)=> {
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await servicesCollection.deleteOne(query);
          res.json(result);
        })





    //   // create a document to insert
    //   const doc = {
    //     title: "Record of a Shriveled Datum",
    //     content: "No bytes, no problem. Just insert a document, in MongoDB",
    //   }
    //   const result = await haiku.insertOne(doc);
    //   console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);





// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });













app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, ()=> {
    console.log('Listening from port:', port);
} )