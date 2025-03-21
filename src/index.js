import dotenv from "dotenv"
import { app } from "./app.js"
import dbConnection from "./db/dbconnection.js"

dotenv.config()

dbConnection()
.then( () => {
    app.on("Error", (error) => {
        console.log("DB Connected but app isn't listening.", error);
        throw error
    })

    app.listen(process.env.PORT || 5500, () => {
        console.log(`Server is listening on port ${process.env.PORT}`);
    })
})
.catch( (error) => {
    console.log("DB Connection Failed.", error);  
})