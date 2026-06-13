/*
=========================================
LECTURE 7 - PROFESSIONAL BACKEND SETUP
=========================================

Goal:
Setup a scalable backend project structure before writing APIs.

1. npm init
- Creates package.json
- Stores project metadata, dependencies and scripts.

2. "type":"module"
- Enables modern ES6 import/export syntax.

3. Git Initialization
- git init creates local repository.
- git add stages files.
- git commit saves snapshot.
- git push uploads code to GitHub.

4. README.md
- Documentation file.
- Explains project purpose and architecture.

5. Nodemon
- Automatically restarts server when code changes.
- Run using: npm run dev

6. Prettier
- Automatically formats code.
- .prettierrc = formatting rules
- .prettierignore = files/folders to ignore

7. src Folder
- Contains application source code.
- Separates code from configuration files.

8. app.js
- Express configuration.
- Middleware setup.
- Route registration.

9. index.js
- Application entry point.
- Starts server.
- Connects database.

10. constants.js
- Stores reusable constants.
- Avoids hardcoding values.

11. Professional Folder Structure

src/
│
├── controllers/
│   Business logic
│
├── routes/
│   API endpoints
│
├── models/
│   Database schemas
│
├── db/
│   Database connection
│
├── middlewares/
│   Authentication, logging, etc.
│
├── utils/
│   Helper functions
│
├── app.js
├── constants.js
└── index.js

Request Flow:

Client
 ↓
Route
 ↓
Middleware
 ↓
Controller
 ↓
Model/Database
 ↓
Response

Main lesson:
Professional backend projects focus on clean structure,
scalability, maintainability and separation of responsibilities.
*/



Git:
Version control system.
Tracks code history locally.

GitHub:
Online storage for Git repositories.

git init
→ Start Git repository.

git add .
→ Stage files.

git commit -m "msg"
→ Save snapshot.

git branch -M main
→ Rename branch to main.

git remote add origin URL
→ Connect local repo to GitHub.

git push -u origin main
→ Upload code to GitHub.

git status
→ Check repository state.

Workflow:
Create file
↓
git add .
↓
git commit
↓
git push




1. What was the goal of this lecture?

In the previous lecture you learned:

Frontend ↔ Backend ↔ API

and created a simple Express server.

This lecture's goal is:

How professional developers start a backend project
before writing actual code.

Think of it as:

Building the office structure
before hiring employees.
2. Why npm init?

You ran:

npm init

This created:

package.json

package.json is the heart of every Node.js project.

It stores:

project name
version
dependencies
scripts
project metadata

Example:

{
  "name":"2nd_backend"
}

means:

This project is called 2nd_backend
3. Why "type":"module"?

By default Node uses:

const express = require("express")

But modern JavaScript uses:

import express from "express"

To enable import/export syntax:

"type":"module"

was added.

4. Why Git initialization?

You ran:

git init

Meaning:

Start tracking project history.

Git created:

.git/

This hidden folder stores commits and project history.

5. Why GitHub?

Git:

Local history

GitHub:

Online backup + collaboration

Flow:

Git → Local
GitHub → Cloud

Commands:

git add .
git commit -m "message"
git push
6. Why create README.md?

README is project documentation.

When someone opens your repository:

README explains:
- What project is
- How to run it
- Architecture
- Notes

Professional projects always have README.

7. Why install Nodemon?

Installed:

npm i -D nodemon

Without nodemon:

node src/index.js

Every code change:

Stop server
Start server again

With nodemon:

Save file
↓
Server restarts automatically

Huge time saver.

8. Why script "dev"?

You added:

"scripts": {
  "dev":"nodemon src/index.js"
}

Now instead of:

nodemon src/index.js

you can simply run:

npm run dev
9. Why install Prettier?

Installed:

npm i -D prettier

Purpose:

Automatic code formatting.

Example:

Bad:

const a=1

Prettier:

const a = 1;

Makes code look consistent.

10. What is .prettierrc?

Configuration for Prettier.

Example:

{
  "semi": true
}

means:

const a = 1;

instead of:

const a = 1
11. What is .prettierignore?

Files Prettier should NOT format.

Example:

node_modules
dist
.env

Reason:

Huge/generated files should not be formatted.
12. Why create src folder?

Instead of:

project/
  index.js

Professional apps use:

project/
  src/
    index.js

Reason:

Keeps source code separate from config files.
13. Why create app.js?

Future responsibility:

Configure Express application.

Examples:

middleware
routes
cors
json parsing
14. Why create index.js?

Future responsibility:

Start the server.
Connect database.

This becomes the entry point.

15. Why create constants.js?

Used for:

export const DB_NAME = "youtube"

Central place for constants.

Avoids hardcoding values everywhere.

16. Why create folders?

You created:

controllers
db
middlewares
models
routes
utils

This is the most important part of the lecture.

controllers

Contains business logic.

Example:

registerUser()
loginUser()
routes

Contains URLs.

Example:

/user/register
/user/login

Routes call controllers.

models

Database schemas.

Example:

User
Video
Tweet
db

Database connection code.

Example:

mongoose.connect()
middlewares

Code that runs before route handlers.

Example:

authentication
authorization
logging
utils

Helper functions.

Example:

ApiResponse
ApiError
asyncHandler

Reusable code.

PROFESSIONAL REQUEST FLOW
Client Request
      ↓
Route
      ↓
Middleware
      ↓
Controller
      ↓
Model / Database
      ↓
Response

This is the architecture he is preparing for.