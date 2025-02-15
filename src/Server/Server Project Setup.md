# Server Project Setup

The first thing that we want to do to get started is to create a branch on our git repository.

![image](Pasted image 20250211214312.png)

Using the UI, we can create a branch off of the main branch and publish it.  Looking at your remote repository you should now be able to see the new branch.

Now any changes we make will not affect the main branch, and we can make sure that all of the features are working and bug free before merging back into main.

### Create the UV project

Next we need to run `uv init --package` in the directory of the server.  By running it in the directory of the server, it will name the package the same as the directory's name.  If you want to specify a name, then run:

`uv init --package dk-server`

Replacing the name with your own projects name.

This will create a src directory, and a pyproject.toml.  The pyproject file is used by uv and build tools to manage dependences and configure the running of tools like pytest.

We also need to add a `.vscode` directory and add a `settings.json` and `extensions.json` files to it.

Other files and directories to add:

- Directories
	- database (in dk-server)
	- docs (in dk-server)
	- devscripts (in src)
	- tests (in dk-server)
	- scripts (in workspace)
- Files
	- Dockerfile (in workspace)
	- .gitignore (in workspace)
	- .dockerignore (in workspace)
	- ruff.toml (in workspace)
	- main.py (in dk_server)

Shown below:

```
dk_server_ws
|- .vscode
|- dk-server
|  |- databases
|  |- docs
|  |- src
|  |  |- devscripts
|  |  |- dk_server
|  |  |  |- __init__.py
|  |  |  |- main.py
|  |- tests
|  |- .python-version
|  |- pyproject.toml
|  |- README.md
|- scripts
|- .dockerignore
|- .gitignore
|- Dockerfile
|- ruff.toml
```

### Configuration

Next we need to start filling out some of these files for configuring the project.  

#### settings.json

```
{
	// Python settings
	"python.analysis.autoSearchPaths": true,
	"python.analysis.diagnosticSeverityOverrides": {
		"reportMissingImports": "none"
	},
	"python.analysis.extraPaths": [
		"${workspaceFolder}/dk-server/src"
	],
	"python.envFile": "${workspaceFolder}/dk-server/.env",
	"python.terminal.activateEnvironment": true,
	"python.defaultInterpreterPath": "${workspaceFolder}/dk-server/.venv/Scripts/python",
	// Test settings
	"python.testing.pytestEnabled": true,
	"python.testing.unittestEnabled": false,
	"python.testing.cwd": "${worksapceFolder}/dk-server/tests",
	"python.testing.pytestPath": "${workspaceFolder}/dk-server/.venv/Scripts/pytest",
	"python.testing.autoTestDiscoverOnSaveEnabled": true,
}
```

These are used by VSCode when running running the project.  The paths describe where various files or directory are that uv and pytest need to operate.  `${workspaceFolder}` is the root of the workspace, in this case that is dk_server_ws.  You will need to check these paths to make sure that they match the names of your own directories.  

***NOTE:***  This if the paths for windows, on linux the `Scripts` in the path might be `bin` instead.

#### extensions.json

```
{
	"recommendations": [
		"ms-python.python",
        "ms-python.vscode-pylance",
        "charliermarsh.ruff",
		"qwtel.sqlite-viewer",
	]
}
```

These are the extensions that you will want to add in order to work on the server.

#### ruff.toml

```
[format]
indent-style = "tab"
```

This to configure ruff to use tabs in stead of spaces for its indention.  You can add any configurations for ruff here.


#### .gitignore

```
# Python-generated files
__pycache__/
*.py[oc]
build/
dist/
wheels/
*.egg-info

# Virtual environments
.venv

# Sphinx Docs builds
docs/build
*rst
!index.rst

# secrets
.env

# Database
*.sqlite


```

These are the files that we do not want git to track or upload to the repository. 


#### .dockerignore

```
# Docker Build tools
docker_run.sh
docker_run.ps1


# Python related
.venv
__pycache__
*.pyc
*.pyo
*.pyd
*.Python
env
pip-log.txt
pip-delete-this-directory.txt
.tox
.coverage
.coverage.*
.cache
.mypy_cache

# Dev related
ruff.toml
.git
.gitignore
.vscode
tests
*.cover
*.log
.pytest_cache
docs
```

These are the files that you do not want docker to build into the image.

#### pyproject.toml

UV will mostly handle this file for you, but you need to add: 

```
[tool.pytest.ini_options]
pythonpath = "src"
```

to the file for pytest to operate.


Now we need to test out the project by making a "hello world" server.
