const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//Middleware
// app.use(cors());
// app.use(express.json());

// const corsConfig = {
//   origin: ["https://stunning-cassata-c2b035.netlify.app"],
//   credentials: true,
// };
// app.use(cors(corsConfig));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://stunning-cassata-c2b035.netlify.app",
      "https://65530682e4bfd91903c02156--stunning-cassata-c2b035.netlify.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7lzpbmm.mongodb.net/?retryWrites=true&w=majority`;
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
    //await client.connect();

    const assignmentCollection = client
      .db("groupstudyDB")
      .collection("assignment");
    const takenCollection = client.db("groupstudyDB").collection("taken");

    //Taken related apis

    //Read Taken
    app.get("/taken", async (req, res) => {
      const cursor = takenCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //Add to taken
    app.post("/taken", async (req, res) => {
      const newTaken = req.body;
      console.log(newTaken);
      const result = await takenCollection.insertOne(newTaken);
      res.send(result);
    });

    //Update taken
    app.put("/taken/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedTaken = req.body;

      const taken = {
        $set: {
          assignmentStatus: updatedTaken.assignmentStatus,
          assignmentNote: updatedTaken.assignmentNote,
          assignmentMarks: updatedTaken.assignmentMarks,
        },
      };

      const result = await takenCollection.updateOne(filter, taken, options);
      res.send(result);
    });

    //Assignment related apis

    //Read Assignment
    app.get("/assignment", async (req, res) => {
      const cursor = assignmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //Read single Assignment
    app.get("/assignment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentCollection.findOne(query);
      res.send(result);
    });

    //Create Assignment
    app.post("/assignment", async (req, res) => {
      const newAssignment = req.body;
      console.log(newAssignment);
      const result = await assignmentCollection.insertOne(newAssignment);
      res.send(result);
    });

    //Update Assignment
    app.put("/assignment/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedAssignment = req.body;

      const assignment = {
        $set: {
          title: updatedAssignment.title,
          description: updatedAssignment.description,
          marks: updatedAssignment.marks,
          thumbnail: updatedAssignment.thumbnail,
          level: updatedAssignment.level,
          duedate: updatedAssignment.duedate,
        },
      };

      const result = await assignmentCollection.updateOne(
        filter,
        assignment,
        options
      );
      res.send(result);
    });

    //Delete Assignment
    app.delete("/assignment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentCollection.deleteOne(query);
      res.send(result);
    });

    //user related apis

    //create user
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("B8M11 Group Study Server is running");
});

app.listen(port, () => {
  console.log(`B8M11 Group Study is listening on port ${port}`);
});
