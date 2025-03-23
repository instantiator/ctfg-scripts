# developer notes

## Prerequisites

These modules have a number of dependencies which ought to be installed with `npm` from the root directory of the repo for development and testing:

```bash
npm install
```

`package.json` must have `"type": "module"` set.

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
* `Authorization`: `Bearer <personal access token>`

The fine-grained PAT must have the following permissions:

* Contents repository permissions (write)

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

### curl example

```bash
curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <PAT>" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/instantiator/ctfg-scripts/dispatches \
  -d '{"event_type":"test","client_payload":{"boolean-value":true,"message":"this is a test"}}'
```

You'll receive a `204` (no content) response on success.
