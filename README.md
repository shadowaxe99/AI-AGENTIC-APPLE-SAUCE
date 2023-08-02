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



## Early preview usage

### JS/TS SDK
Use SDK from our old project [here](https://github.com/devbookhq/sdk).

```sh
npm i @devbookhq/sdk
```

#### Initialize new env session
```typescript
import { Session } from '@devbookhq/sdk'

const session = new Session({
  id: 'Nodejs', // Can also be one of "Nodejs", "Go", "Bash", "Rust", "Python3", "PHP", "Java", "Perl", "DotNET"
  onDisconnect: () => console.log('disconnect'),
  onReconnect: () => console.log('reconnect'),
  onClose: () => console.log('close'),
})
```

#### Use filesystem inside cloud environment
```typescript
// List
const dirBContent = await session.filesystem.list('/dirA/dirB')

// Write
// This will create a new file 'file.txt' inside the dir 'dirB' with the content 'Hello world'.
await session.filesystem.write('/dirA/dirB/file.txt', 'Hello World')

// Read
const fileContent = await session.filesystem.read('/dirA/dirB/file.txt')

// Remove
// Remove a file.
await session.filesystem.remove('/dirA/dirB/file.txt')
// Remove a directory and all of its content.
await session.filesystem.remove('/dirA')

// Make dir
// Creates a new directory 'dirC' and also 'dirA' and 'dirB' if those directories don't already exist.
await session.filesystem.makeDir('/dirA/dirB/dirC')

// Watch dir for changes
const watcher = session.filesystem.watchDir('/dirA/dirB')
watcher.addEventListener(fsevent => {
  console.log('Change inside the dirB', fsevent)
})
await watcher.start()
```

#### Start process inside cloud environment
```typescript
const proc = await session.process.start({
  cmd: 'echo 2',
  onStdout: stdout => consoel.log(stdout),
  onStderr: stderr => console.log(stderr),
  onExit: () => console.log('exit'),
  envVars: { ['ENV']: 'prod' },
  rootdir: '/',
  processID: '<process-id>',
})

await proc.kill()

await proc.sendStdin('\n')

console.log(proc.processID)
```


### Python SDK
We're working on a native Python SDK. Please use raw HTTP requests in the meantime.

### HTTP requests
Create a new Nodejs session:
```bash
curl --request POST \
  --url 'https://api.e2b.usedevbook.com/sessions' \
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
  --url 'https://api.e2b.usedevbook.com/sessions/sojem4y9-fce131d5/processes?wait=true' \
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

> You can check a Python API client generated for almost identical API [here](https://github.com/e2b-dev/e2b/tree/main/api-service/playground_client) and a wrapper for this API so an agent written in Python can use it as a playground [here](https://github.com/e2b-dev/e2b/tree/main/api-service/session/playground).

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
