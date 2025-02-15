# Introduction

The first part of the project that we will be working on is creating the backed which will be a python FastAPI server that uses a SQLite database to save data.  

### FastAPI

FastAPI is how our mobile app and website will communicate with the server to request and submit data.  FastAPI works through http requests where the arguments of the request are encoded into the URL.  

Example:  
```
POST dkapp.com/grocery/item/1/"Soup"/2
```

POST, grocery, and item define the path for the function being called, and 1, "Soup", and 2 are augments passed to the function.

### Plan

Here is an overview of how this project will go.

- We start a new git branch for development of the server.
- Use UV to create the python environment.
- Add VSCode extensions, add dependences for Pytest, and Numpy docs.
- Make a "Hello World" server.
- Set up Docker and configure the project to hot reload in it.
- Design and setup the database.
- Then add features, add tests, add docs, commit for:
	- CRUD on the database.
	- Routes
	- Authentications
	- etc.

Lets get started.


