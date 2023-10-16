const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// ===================
// -------------------
// mongodb connections

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wgolkq8.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const milkColection = client.db("milkDB").collection("milk");

    // --------------------------------
    // mongodb te data set korar system
    app.post("/milk", async (req, res) => {
      const newMilk = req.body;
      console.log(newMilk);
      const result = await milkColection.insertOne(newMilk);
      res.send(result);
    });
    // -----------------------------------
    // localhost api te dekhanor sysrem

    app.get("/milk", async (req, res) => {
      const cursor = milkColection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // ----------------------------------
    // delete korer system
    app.delete("/milk/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await milkColection.deleteOne(query);
      res.send(result);
    });

    // ____-------------------------
    // detect specifiq id
    app.get("/milk/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await milkColection.findOne(query);
      res.send(result);
    });
    // ----------------------------------
    // Update a prodact
    app.put("/milk/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateMilk = req.body;
      const milk = {
        $set: {
          name: updateMilk.name,
          quentity: updateMilk.quentity,
          suplier: updateMilk.suplier,
          teste: updateMilk.teste,
          category: updateMilk.category,
          details: updateMilk.details,
          photo: updateMilk.photo,
        },
      };
      const result = await milkColection.updateOne(filter, milk, options);
      res.send(result);
    });
    // ---------------------------------
    // ---------------------------------
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// =================
// -----------------

app.get("/", (req, res) => {
  res.send("milk making server is running");
});

app.listen(port, () => {
  console.log(`milk server is running: ${port}`);
});
