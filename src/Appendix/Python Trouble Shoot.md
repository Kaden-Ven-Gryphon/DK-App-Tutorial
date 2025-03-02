# Python Trouble Shooting

### `UV sync cant find module encodings`

I had this issue when creating my first docker image.  I was able to fix it by deleting the `.venv` directory and letting uv create a new one.

