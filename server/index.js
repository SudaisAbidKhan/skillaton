import "dotenv/config.js";
import { app } from "./app.js"
import connectDB from "./db/config.js"

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () =>{
        console.log(`Server is not running on port ${process.env.PORT || 8000}`)
    })
})
.catch((err) => {
    console.log("MONGODB Connection FAILED:", err)
})