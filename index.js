require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello assignment");
});

// crowdcube
// X0frp4FWTIvEpJl6

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://crowdcube:X0frp4FWTIvEpJl6@cluster0.428x9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    const crowdcubeCollection = client
      .db("crowdcubeDB")
      .collection("campaigns");

    const donationCollection = client
      .db("crowdcubeDB")
      .collection("donatedUser");

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.post("/campaigns", async (req, res) => {
      const result = await crowdcubeCollection.insertOne(req.body);
      res.send(result);
    });

    app.post("/donations", async (req, res) => {
      const result = await donationCollection.insertOne(req.body);
      res.send(result);
    });

    app.get("/campaigns", async (req, res) => {
      const result = await crowdcubeCollection.find().toArray();
      res.send(result);
    });

    app.get("/donations", async (req, res) => {
      const result = await donationCollection.find().toArray();
      res.send(result);
    });

    app.get("/campaigns/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await crowdcubeCollection.findOne(query);
      res.send(result);
    });

    app.put("/campaigns/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const data = req.body;
      const options = { upsert: true };
      const updatedData = {
        $set: {
          photo: data.photo,
          title: data.title,
          type: data.type,
          description: data.description,
          amount: data.amount,
          deadline: data.deadline,
        },
      };
      const result = await crowdcubeCollection.updateOne(
        filter,
        updatedData,
        options
      );
      res.send(result);
    });

    app.get("/donations/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await donationCollection.findOne(query);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("running duh!");
});
