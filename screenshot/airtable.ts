import { AirtableSecrets, ScreenshotOptions } from "./config";
import { AIRTABLE_API_URL } from "./constants";

interface AirtableAttachmentRequest {
  url: string;
}

interface AirtableMediaRecordRequest {
  File: AirtableAttachmentRequest[];
  Link: string;
  Listings: string[];
}

interface AirtableCreateMediaRequest {
  fields: AirtableMediaRecordRequest;
}

interface AirtableCreateMediaRecordRequest {
  records: AirtableCreateMediaRequest[];
}

interface AirtableAttachmentResponse {
  url: string;
  id: string;
  filename: string;
}

interface AirtableMediaRecordResponse {
  Id: string;
  Listings: string[];
  Link: string;
  File: AirtableAttachmentResponse[];
}

interface AirtableCreateMediaResponse {
  fields: AirtableMediaRecordResponse;
  id: string;
  createdTime: string;
}

interface AirtableCreateMediaRecordResponse {
  records: AirtableCreateMediaResponse[];
}

interface AirtableListingRecordRequest {
  Images: string[];
}

interface AirtableUpdateListingRequest {
  id: string;
  fields: AirtableListingRecordRequest;
}

interface AirtableUpdateListingRecordRequest {
  records: AirtableUpdateListingRequest[];
}

export function createAirtableCreateMediaRecordRequest(
  s3Url: string,
  recordId: string
): AirtableCreateMediaRecordRequest {
  const request: AirtableCreateMediaRecordRequest = {
    records: [
      {
        fields: {
          File: [{ url: s3Url }],
          Link: s3Url,
          Listings: [recordId],
        },
      },
    ],
  };
  return request;
}

export async function sendAirtableCreateMediaRecordRequest(
  request: AirtableCreateMediaRecordRequest,
  airtable: AirtableSecrets,
  options: ScreenshotOptions
): Promise<AirtableCreateMediaRecordResponse> {
  const url = `${AIRTABLE_API_URL}/${options.airtable_base}/Media`;
  console.log(`Sending request to: ${url} ...`);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${airtable.AIRTABLE_TOKEN}`,
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });

  const text = await response.text();
  const record = JSON.parse(text) as AirtableCreateMediaRecordResponse;

  if (record?.records?.length !== 1) {
    throw `Created ${record?.records?.length ?? 0} media records. ${text}`;
  }

  console.debug(`Created record with id: ${record.records[0].fields.Id}`);
  return record;
}

export function createUpdateAirtableListingRecordRequest(
  listingId: string,
  mediaRecordId: string
): AirtableUpdateListingRecordRequest {
  return {
    records: [
      {
        id: listingId,
        fields: {
          Images: [mediaRecordId],
        },
      },
    ],
  };
}

export function sendUpdateAirtableListingRecordRequest(
  request: AirtableUpdateListingRecordRequest,
  airtable: AirtableSecrets,
  options: ScreenshotOptions
): Promise<Response> {
  const url = `${AIRTABLE_API_URL}/${options.airtable_base}/Listings`;
  console.log(`Sending request to: ${url} ...`);

  const headers = {
    "Content-Type": "application/json charset=UTF-8",
    Authorization: `Bearer ${airtable.AIRTABLE_TOKEN}`,
  };

  return fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(request),
  });
}
