const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors=require('cors');

require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b0pni.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{

        await client.connect();
        const database = client.db("foodlover");
        const servicesCollection = database.collection("services");
        const usersCollection = database.collection("users");



        // GET API
        app.get('/services', async (req, res) => {
          const cursor = servicesCollection.find({});
          const services = await cursor.toArray();
          res.send(services);
      });


      // GET Single Service
      app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        console.log('getting specific service paisi', id);
        const query = { _id: ObjectId(id) };
        const service = await servicesCollection.findOne(query);
        res.json(service);
    })

        // post api for services
        app.post('/services',async(req,res)=>{
            
            const service =req.body;
            // console.log('hit the post api',service);
            // res.send('post hitted');
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });
    

       // post api for users
       app.post('/users',async(req,res)=>{
            
        const user =req.body;
        console.log('hit the post users api',user);
        // res.send('post hitted');
        const answer = await usersCollection.insertOne(user);
        console.log(answer);
        res.json(answer)
    });

    // GET API for users
    app.get('/users', async (req, res) => {
      const user = usersCollection.find({});
      const getUser = await user.toArray();
      res.send(getUser);
  });

    // DELETE API
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.json(result);
  })



}

    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log("Example app listening at http://localhost:",port)
})