import express from "express" 
import cors from "cors"
import dbConnection from "./config/dbConnection.js"
import { addPostsController, getInfiniteScrollController, getPaginationController } from "./controllers/CachedPostsController.js"

const app  = express()
const PORT = process.env.PORT || 5000

dbConnection()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

//routes
app.post("/add-post", addPostsController)
app.get("/curser-based-pagination", getInfiniteScrollController)
app.get("/offset-based-pagination", getPaginationController)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})