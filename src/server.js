//! Entry Point of the Application 
// use for connecting to the database and starting the server 

import connectDB from './db/database_connection.js';

import { app } from "./app.js"; // ✅ Importing the already-configured app
import dotenv from 'dotenv';

dotenv.config();

connectDB()
.then(()=> {
    // Starting the server only after a successful database connection
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running on port :" ${ process.env.PORT}`);  
    });

    //Now, console.log runs only after the server starts successfully.
    // If app.listen fails, the message won’t be printed, preventing misleading logs.

})
.catch((err)=> {
    // printing the error if with the perticular error printing with the massage 
    console.log("mongodb connection failed", err); 
})
