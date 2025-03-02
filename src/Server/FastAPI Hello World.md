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

You will need to have docker installed. [https://www.docker.com/](https://www.docker.com/)

The project will also need a dockerfile.  This will be the directions that docker will use to create the container image of our api server.

I used this as my reference for making my dockerfile: [link](https://github.com/astral-sh/uv-docker-example/tree/main)


```
# Use a Python image with uv pre-installed
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

# Install the project into `/app`
WORKDIR /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy from the cache instead of linking since it's a mounted volume
ENV UV_LINK_MODE=copy

# Install the project's dependencies using the lockfile and settings
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=./dk-server/uv.lock,target=uv.lock \
    --mount=type=bind,source=./dk-server/pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project --no-dev

# Then, add the rest of the project source code and install it
# Installing separately from its dependencies allows optimal layer caching
ADD ./dk-server/ /app
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"
# ENV UV_ENV_FILE="./.env"

# Reset the entrypoint, don't invoke `uv`
ENTRYPOINT []

# Run the FastAPI application by default
# Uses `fastapi dev` to enable hot-reloading when the `watch` sync occurs
# Uses `--host 0.0.0.0` to allow access from outside the container
CMD ["/app/.venv/bin/uvicorn", "--app-dir", "./src/dk_server", "dk_server.main:app", "--port", "8000", "--host", "0.0.0.0"]
```

- First it installs uv in the container.
- Then sets the working directory as `app`.
- Sets some environment variables.
- The first run commands loads in the projects lock file, pyproject.toml, and cache and installs all the project's dependencies.
- Then the source files are added to container
- The bin folder is added to the environments path.
- Finally a command is run in the container to run the server.

I had to change quite a few paths in this file compared to the example one from the GitHub due to my project structure and where the dockerfile sets.

#### Build

To build the image you can run:

```
docker build -t dk-app-server .
```

`-t` is the name of the image.
`.` is the location of the files, in this case the current directory.

I had a few issues building my image, I was able to eventually fix them by deleting the `.venv` directory.

#### Run

To run the container you can run:

```
docker run dk-app-server -p 8000:8000
```

This should start up the container, and the uvicorn server, so you can go to `localhost:8000` to see the hello world message.

#### Hot Reloading

As we saw earlier you can use `--reload` when running uvicorn to automatically restart the server when changes are made to the source code.  This won't work in the container though as the code in the container is a copy of the project.

While developing the server we want to be able to keep the option of hot reloading.  We could just develop the server running uvicorn directly, and then occasionally testing it as a container, but this can cause issues if for some reason your project runs fine locally, but does not run in the container then you have to go through all your changes from the last time you ran the container and figure out which one broke it.

We want to be able to hot reload the server *while* it is in the container.  This can be done by mounting the project files into the container so that local files are used instead of the copies in the container.

`run.ps1`
```
Param(
	$Command
)
If (-Not $Command -eq '') {
	docker run --rm --name devtest --mount type=bind,source=$(pwd)/dk-server,target=/app --volume /app/.venv --publish 8000:8000 -it $(docker build -q .) "$Command"
} Else {
	docker run --rm --name devtest --mount type=bind,source=$(pwd)/dk-server,target=/app --volume /app/.venv --publish 8000:8000 -it $(docker build -q .)  "./src/devscripts/start.sh"
}
```

The GitHub with the example dockerfile also has a bash script to run the image with the source files mounted.  

I am working in windows at the moment so I had to convert it into a PowerShell script.  It works okay enough.  If you use the bash script instead, for this file structure `.:/app` will need to be changed to `./dk-server:/app`.  I also suggest changing the `--volume` to a `--mount` like in the above PowerShell script.  I was having issues with changes in the source files not appearing in the the container and finally figured out it was because I had accidently created a named volume instead.

Here is docker's docs on how volumes and binds work: [link](https://docs.docker.com/engine/storage/volumes/)

The other thing that needs to be added is the `start.sh` script.  This is just a one line bash script that runs the command with all the options set for starting the uvicorn server with reloading.

`start.sh`
```
#!/usr/bin/env sh
uv run uvicorn --app-dir ./src/dk_server dk_server.main:app --port 8000 --host 0.0.0.0 --reload
```

I put this in a `devscripts` directory under the `src` directory.

Now you should be able to run `.\scripts\run.ps1` to start the container with the source code mounted as a bind and start uvicorn with reloading enabled.  Or you can run `.\scripts\run.ps1 /bin/bash` to start the container and start the command line in the container to test things.


## Action Buttons

Because we now have quite a few command that we have to run to work on or test the server I recommend setting up action buttons.  We already have the bash and PowerShell scripts to shorten it a little, but we can add a button to VSCode to run those scripts.   These settings will need to be added to you workspace save files setting section.

```
// Action Buttons

	"actionButtons": {
		"defaultColor": "#ff0034", // Can also use string color names.
		"loadNpmCommands":false, // Disables automatic generation of actions for npm commands.
		"reloadButton":"♻️", // Custom reload button text or icon (default ↻). null value enables automatic reload on configuration change
		"commands": [
			{
				"cwd": "${workspaceFolder}",
				"name": "$(triangle-right) Run Container",
				"color": "green",
				"command": ".\\scripts\\run.ps1",
			},
			{
				"cwd": "${workspaceFolder}",
				"name": "$(tools) Bash Container",
				"color": "white",
				"command": ".\\scripts\\run.ps1 /bin/bash",
			},
			{
				"cwd": "${workspaceFolder}",
				"name": "$(close)Docker Close",
				"color": "red",
				"command": ".\\scripts\\clean.ps1"
			}
		]
	}
```

This will add three action buttons for us:

- "Run Container" This will run the PowerShell script to run the container with the source code bind and hot reloading.
- "Bash Container" This will open up the bash shell in the container.
- "Docker Close" This will stop the container and remove and images.

`clean.ps1`
```
docker stop devtest
docker image prune -f
```

These action button use the `${workSpaceFolder}` as the cwd.  VSCode uses the workspace of the currently active file to determine what you current workspace is.  This means that these will only work if you have on of the files for the dk_server_ws part of the project currently open.

Feel free to change this to a hardcoded path, or to what ever you prefer depending on how you set up your workspace.

Try making an action button to start up uvicorn without docker if you want.

Next we will set up pytest.