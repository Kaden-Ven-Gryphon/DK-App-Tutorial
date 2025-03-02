
## Start server with hot reloading:

#### Docker start script

```
.\scripts\run.ps1
```

#### Docker start shell

```
.\scripts\run.ps1 /bin/bash
```

#### uvicorn start command

```
uv run uvicorn --app-dir ./src/dk_server dk_server.main:app --port 8000 --host 0.0.0.0 --reload
```



### Docker

```
docker build -t <IMAGE-NAME> .
docker run --rm --name <CONTAINER-NAME> -p <SOURCE-PORT>:<DESTINATION-PORT> <IMAGE-NAME>
docker volumes prune
docker images prune
```

#### Example

```
docker build -t dk-app-server .
docker run --rm --name dk-app-api -p 8000:8000 dk-app-server
```