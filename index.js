const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;
// use middleware
app.use(cors()); // 3000 t0 5000 connected
app.use(express.json()); //get data from req.body

// user: dbuser1
//  password: 6jZ6p2RPitx0yh1p



const uri = "mongodb+srv://dbuser1:6jZ6p2RPitx0yh1p@cluster0.qdexp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const collection = client.db("foodExpress").collection("users");
//     console.log('db connected');
//     // perform actions on the collection object
//     client.close();
// });
async function run() {
    try {
        await client.connect();
        const userCollection = client.db('foodExpress').collection("user");
        // const user = { name: 'Mohona nadi', email: 'nodi@gmail.com' };
        // const result = await userCollection.insertOne(user);
        // console.log(`A document was inserted with the id: ${result.insertedId}`)


        //    Get users
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        // POST user : add a new user
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            console.log('adding new user', newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result)

        });
        // Update User
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            };
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })

        // Delete a User
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running my Node Crud Server');
});

app.listen(port, () => {
    console.log('CRUD Server is running');
})
