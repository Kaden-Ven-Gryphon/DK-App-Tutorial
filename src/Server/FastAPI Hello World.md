# FastAPI Hello World

To test that all these extensions are working and that the settings are properly configured we need to make our "hello world program"

### First Hello

Before we try to make the server lets just try to run any python file.

In `main.py` add:

```
def main():
	print("Hello World")



if __name__ == "__main__":
	main()
```

and run 

```
uv run .\dk-server\src\dk_server\main.py
```

you might need to change the slash depending on which platform you are on, and the names in the path to match your project.  You also need to make sure that this is ran with the workspace as the working directory.

Hopefully you should see `Hello World` in the output.

### Hello (but server this time)

Now we need to add some dependencies to the project.

First we run:

```
uv add --directory .\dk-server\ fastapi "uvicorn[standard]"
```

uvicorn is the server that we will be using to host our api.

This should add fastapi and uvicorn to our pyproject.toml file.

(`--directory \dk-erver\` is only needed if you are running your terminal commands from with the workspace as the working directory, I will be using that as my working directory for all further steps unless specified.)

We then change main.py to:

```
from fastapi import FastAPI, Response

app = FastAPI()


@app.get("/")
def root():
	return Response(content="This is dk_server Root", media_type="text")

```


To test this we then run:

```
uv run --directory .\dk-server\ uvicorn --app-dir .\dk-server\src\ dk_server.main:app --reload
```

`--app-dir` is where the server package is located.

`--reload` means that the server will stay running and anytime changes are made, the server will automatically reset and add those changes.

To test if it is working you can enter the url `localhost:8000` in to your browser and it should return "This is dk_server Root"

### Hello (but container this time)

The next thing to test to running the server from a docker image and container.

You will need to have docker installed. https://www.docker.com/

