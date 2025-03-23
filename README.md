# ctfg-scripts

Make a POST to the repository dispatches url:

```
https://api.github.com/repos/instantiator/ctfg-scripts/dispatches
```

Add these headers:

- `Accept`: `application/vnd.github+json`
- `Authorization`: `Bearer <personal access token>`

The fine-grained PAT must have the following permissions:

- Contents repository permissions (write)

Provide the event type in the body.

## Screenshots

Provide the following body:

```json
{
  "event_type": "screenshot",
  "client_payload": {
    "id": "<record-id>",
    "url": "<url-to-screenshot>",
    "aws_bucket": "<aws-s3-bucket>",
    "aws_region": "<aws-region>",
    "airtable_base": "CTFG"
  }
}
```

I'd guess our AWS region is: `eu-west-2`

## Secrets

The following GitHub Actions repository secrets are required:

| Secret              |
| ------------------- |
| `TECHULUS_API_KEY`  |
| `TECHULUS_SECRET`   |
| `AWS_ACCESS_KEY`    |
| `AWS_ACCESS_SECRET` |
| `AIRTABLE_TOKEN`    |
