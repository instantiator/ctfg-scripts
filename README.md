# ctfg-scripts

## Prerequisites

These modules use `tsx` - install with `npm` from the root directory of the repo.

```bash
npm install
```

Ensure that `package.json` has `"type": "module"` set.

## Triggering a workflow from a webhook

* Add a `repository_dispatch` trigger to your workflow:

```yaml
on:
  repository_dispatch:
    types:
      - MyEvent
```

### To trigger the workflow

Make a POST to the repository dispatches url: `https://api.github.com/repos/{owner}/{repo}/dispatches`

Add these headers:

* `Accept`: `application/vnd.github+json`
* `Authorization`: `<personal access token>`

The PAT must have the `repo` access scope.

Provide the event type in the body, as:

```json
{
  "event_type": "MyEvent"
}
```

### To trigger the workflow with data

Include data under the `client_payload` key, and it will be available to the workflow in `github.event.client_payload`, ie.

```json
{
  "event_type": "MyEvent",
  "client_payload": {
    "action": "do-something"
  }
}
```

You can refer to this later in the workflow: `github.event.client_payload`, or even pass the entire object as JSON eg.

```yaml
env:
  MESSAGE: ${{ github.event.client_payload.message }}
  CLIENT_PAYLOAD: ${{ toJson(github.event.client_payload) }}
```
