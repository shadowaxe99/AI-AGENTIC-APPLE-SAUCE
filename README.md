  <h1 align="center">E2B REST API</h1>
	<p align="center">
		<a href="https://discord.gg/U7KEcGErtQ" target="_blank">
			<img src="https://img.shields.io/static/v1?label=Join&message=%20discord!&color=mediumslateblue">
		</a>
		<a href="https://twitter.com/e2b_dev" target="_blank">
			<img src="https://img.shields.io/twitter/follow/e2b.svg?logo=twitter">
		</a>
	</p>

The E2B REST API provides an interface for managing development environments and their filesystems and processes.

We give you a full cloud development environment that's sandboxed. That means:

- Access to Linux OS
- Using filesystem (create, list, and delete files and dirs)
- Run processes
- Sandboxed - you can run any code
- Access to the internet

These cloud environments are meant to be used for agents. Like a sandboxed playgrounds, where the agent can do whatever it wants.

## Example usage
Create a new Nodejs session:
```bash
curl --request POST \
  --url http://localhost:3000/sessions \
  --header 'Content-Type: application/json' \
  --data '{
  "envID": "Nodejs"
}'
```
```json
{
	"id": "sojem4y9-fce131d5",
	"ports": []
}
```


Execute a command in the session:
```bash
curl --request POST \
  --url 'http://localhost:3000/sessions/sojem4y9-fce131d5/processes?wait=true' \
  --header 'Content-Type: application/json' \
  --data '{
  "cmd": "echo 22",
  "rootdir": "/"
}'
```
```json
{
	"stdout": [
		{
			"type": "Stdout",
			"line": "22",
			"timestamp": 1690899755863633000
		}
	],
	"stderr": [],
	"finished": true,
	"processID": "g9VD2Z1v8DUH"
}
```

> You can check a Python API client generated for almost identical API [here](https://github.com/e2b-dev/e2b/tree/main/api-service/playground_client) and a wrapper for this API so an agent written in Python can it use as a playground [here](https://github.com/e2b-dev/e2b/tree/main/api-service/session/playground).

## Endpoints
### Sessions

- `POST /sessions`: Create a session. Requires an environment type - `Nodejs`, `Go`, `Bash`, `Rust`, `Python3`, `PHP`, `Java`, `Perl`, or `DotNET`.

- `GET /sessions/{sessionID}`: Refresh an existing session. **Sessions will be deleted if there has been no request to them for 10 minutes**.

- `DELETE /sessions/{sessionID}`: Delete a specific session.

### Filesystem
- `DELETE /sessions/{sessionID}/filesystem`: Delete a dir or file entry.

- `GET /sessions/{sessionID}/filesystem/dirs`: List the contents of a directory.

- `PUT /sessions/{sessionID}/filesystem/dirs`: Create a new directory.

- `GET /sessions/{sessionID}/filesystem/files`: Read a file. The returned content will be UTF-8 encoded.

- `PUT /sessions/{sessionID}/filesystem/files`: Write to a file. The content of the file must be UTF-8 encoded.

> Right now we don't support reading and writing binary files. We're working on it.

### Processes
- `POST /sessions/{sessionID}/processes`: Start a process. If the `wait` query parameter is true, the request will wait until the process ends, then return the stdout, stderr, and processID.

- `GET /sessions/{sessionID}/processes/{processID}`: Get a specific process's information. If the `wait` query parameter is true, the request will wait until the process ends, then return the stdout, stderr, and processID. If not, the request will return the process's current status and current stdout and stderr.

- `DELETE /sessions/{sessionID}/processes/{processID}`: Stop a process.

- `POST /sessions/{sessionID}/processes/{processID}/stdin`: Write to a process's stdin.


## Development
Install dependencies:
```bash
npm install
```

Then start reloading server by running:
```bash
npm run dev
```

## What is e2b?
[E2B](https://www.e2b.dev/) is the company behind this repo. We're building an operating system for AI agents. A set of low-level APIs for building agents (debugging, auth, monitor, and more) together with sandboxed cloud environments for the agents where the agents can roam freely without barriers 🐎.
