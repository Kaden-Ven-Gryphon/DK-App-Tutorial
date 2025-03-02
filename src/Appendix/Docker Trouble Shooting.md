# Docker Trouble Shooting

### Bind mount does not update in container when updated on host.

I had this issue, and it was because I was using the `--volume` command.  I so how accidently created a named volume one of the times I was running the images and so every time after that when I ran the image it mounted this named volume instead of binding the source files.  Use `--mount` to explicitly state what you want, and look for unwanted volumes with `docker volume ls`