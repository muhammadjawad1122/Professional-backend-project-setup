*
========================================================
HOW TO CONNECT DATABASE IN MERN (WITH DEBUGGING FLOW)
========================================================

GOAL:
Connect MongoDB Atlas with Node + Express backend
and understand how real debugging happens during setup.

--------------------------------------------------------
1. PROJECT START (BACKEND SETUP)
--------------------------------------------------------

We already have a professional backend structure:

src/
│
├── db/
├── constants.js
├── index.js

Dependencies used:

- express → server creation
- mongoose → MongoDB connection
- dotenv → environment variables
- nodemon → auto restart server

--------------------------------------------------------
2. PACKAGE.JSON SETUP
--------------------------------------------------------

"type": "module"

Meaning:
- We are using ES Modules system
- So we use import/export instead of require()

Dev script:

"dev": "nodemon -r dotenv/config src/index.js"

Meaning:
- nodemon → auto restart server on changes
- dotenv/config → loads .env automatically
- src/index.js → entry file

--------------------------------------------------------
3. ENVIRONMENT VARIABLES (.env)
--------------------------------------------------------

We store sensitive data here:

PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/

Why?
- Keeps secrets hidden
- Easy to change without touching code
- Required for production-ready apps

--------------------------------------------------------
4. ENTRY FILE (index.js FLOW)
--------------------------------------------------------

Application starts from:

src/index.js

Flow:

1. Load DNS config (optional debugging improvement)
2. Load dotenv
3. Import database connection function
4. Call connectDB()

Code flow:

import dns from "node:dns"
dns.setServers(["1.1.1.1", "8.8.8.8"])

import dotenv from "dotenv"
dotenv.config()

import connectDB from "./db/index.js"

connectDB()

Meaning:
- First environment is prepared
- Then database connection starts

--------------------------------------------------------
5. DATABASE CONNECTION FILE (db/index.js)
--------------------------------------------------------

This is the heart of database connection.

Flow:

1. Read environment variables
2. Build MongoDB connection string
3. Connect using mongoose
4. Return success or error

Code logic:

const connectionInstance = await mongoose.connect(
    `${process.env.MONGODB_URI}/${DB_NAME}`
)

After successful connection:

console.log("MongoDB Connected !! DB HOST:", connectionInstance.connection.host)

Meaning:
- MongoDB Atlas connection established
- Host confirms active cluster connection

--------------------------------------------------------
6. CONSTANTS FILE
--------------------------------------------------------

constants.js

export const DB_NAME = "learnigsource"

Why?
- Avoid hardcoding database name everywhere
- Central configuration file

--------------------------------------------------------
7. FULL CONNECTION FLOW (IMPORTANT MENTAL MODEL)
--------------------------------------------------------

Application start
        ↓
index.js runs
        ↓
dotenv loads .env
        ↓
DB_NAME + MONGODB_URI read
        ↓
connectDB() called
        ↓
mongoose.connect()
        ↓
MongoDB Atlas contacted
        ↓
Database selected
        ↓
Connection successful

--------------------------------------------------------
8. DEBUGGING JOURNEY (REAL-WORLD UNDERSTANDING)
--------------------------------------------------------

During setup, different types of issues can happen:

1. DNS Issue
----------------------------------------
Meaning:
MongoDB cluster name cannot be resolved

Fix:
- DNS servers like 1.1.1.1 / 8.8.8.8
- Stable internet connection

--------------------------------------------------------

2. Authentication Issue
----------------------------------------
Meaning:
MongoDB Atlas rejects login credentials

Fix:
- Check username/password
- Check cluster URI
- Ensure user is created in Atlas

--------------------------------------------------------

3. Environment Loading Issue
----------------------------------------
Meaning:
.env not properly loaded

Fix:
- correct dotenv setup
- ensure correct path or auto loader used

--------------------------------------------------------

9. FINAL SUCCESS STATE
--------------------------------------------------------

When everything works:

- dotenv loaded correctly
- MongoDB URI detected
- Database name attached
- Connection successful
- Host printed from cluster

Example output:

MongoDB Connected !!
DB HOST: ac-6kfxxu9-shard-00-00.mongodb.net

--------------------------------------------------------
10. MOST IMPORTANT CONCEPTS
--------------------------------------------------------

1. SEPARATION OF RESPONSIBILITY
----------------------------------------
index.js → starts app
db/index.js → handles database
constants.js → stores config

--------------------------------------------------------

2. MONGOOSE CONNECTION MODEL
----------------------------------------
mongoose.connect() is asynchronous
so we use async/await

--------------------------------------------------------

3. ENV IS CRITICAL
----------------------------------------
Without .env:
- database cannot connect
- credentials are exposed
- app breaks in production

--------------------------------------------------------

4. DEBUGGING THINKING
----------------------------------------
Real backend developers don’t just code

They check:
- environment variables
- DNS resolution
- authentication
- connection logs

--------------------------------------------------------

FINAL MENTAL MODEL
--------------------------------------------------------

App Start
   ↓
Environment Load (.env)
   ↓
Constants Load
   ↓
DB Connection Function Call
   ↓
Mongoose Connects to Atlas
   ↓
Database Selected
   ↓
Connection Success
   ↓
Backend Ready 🚀

========================================================
END OF LECTURE
========================================================
*