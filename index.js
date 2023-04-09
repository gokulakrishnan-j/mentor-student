import express from "express"
import * as dotenv from "dotenv"
dotenv.config()
import { MongoClient } from "mongodb"

const app =express()
 app.use(express.json())
 const PORT = process.env.PORT

const MONGO_URL = process.env.MONGO_URL
const client = new MongoClient(MONGO_URL)
await client.connect()

app.get("/",function(request,response){

    response.send("Hello Guys")
})

app.post("/mentor",async function(request,response){
    
    const obj = {
        name:request.body[0].name,
        role:"mentor"
    }

    const mentors = await client
    .db("mentor")
    .collection("mentors")
    .insertOne(obj);

    response.status(201).send(mentors)
})

app.post("/student",async function(request,response){
    
    

    const students = await client
    .db("mentor")
    .collection("students")
    .insertMany(request.body);

    response.status(201).send(students)
})
app.put("/assignmentor/multi",async function(request,response){
 

    const assign = await client
    .db("mentor")
    .collection("students")
    .updateMany({mentor:{$exists:false}},{$set:{mentor:request.body[0].name}});

    response.send(assign)
})

app.put("/changementor",async function(request,response){
 

    const changeMentor = await client
    .db("mentor")
    .collection("students")
    .updateOne({name:request.body[0].studentname},{$set:{mentor:request.body[0].mentorname}});

    response.send(changeMentor)
})

app.get("/students/:mentor",async function(request,response){
 const {mentor} = request.params


    const changeMentor = await client
    .db("mentor")
    .collection("students")
    .find({mentor:mentor})
    .toArray();

    response.send(changeMentor)
})


app.listen(PORT)