import { exit } from "process";
import {
    createAirtableCreateMediaRecordRequest,
    createUpdateAirtableListingRecordRequest,
    sendAirtableCreateMediaRecordRequest,
    sendUpdateAirtableListingRecordRequest,
} from "./airtable";
import { uploadToS3 } from "./aws";
import { AirtableSecrets, AwsSecrets, require, ScreenshotOptions, TechulusSecrets } from "./config";
import { download, genTechulusUrl } from "./techulus";

export async function screenshot() {
  const options = JSON.parse(process.env.CLIENT_PAYLOAD!) as ScreenshotOptions;
  const techulus = JSON.parse(process.env.SECRETS!) as TechulusSecrets;
  const aws = JSON.parse(process.env.SECRETS!) as AwsSecrets;
  const airtable = JSON.parse(process.env.SECRETS!) as AirtableSecrets;
  require(options, "CLIENT_PAYLOAD");
  require(techulus, "SECRETS (techulus)");
  require(aws, "SECRETS (aws)");
  require(airtable, "SECRETS (airtable)");

  const screenshotUrl = genTechulusUrl(options.url, techulus);
  console.log(`Screenshot url: ${screenshotUrl}`);

  const destination = await download(screenshotUrl, "screenshots");
  console.log(`Screenshot saved to: ${destination}`);

  const uploadedUrl = await uploadToS3(destination, options, aws);
  console.log(`Screenshot uploaded to: ${uploadedUrl}`);

  const mediaRequest = createAirtableCreateMediaRecordRequest(uploadedUrl, options.id);
  console.log(`Airtable media record request: ${JSON.stringify(mediaRequest)}`);

  const mediaResponse = await sendAirtableCreateMediaRecordRequest(mediaRequest, airtable, options);
  console.log(`Airtable media record created: ${JSON.stringify(mediaResponse)}`);

  const listingRequest = createUpdateAirtableListingRecordRequest(
    options.id,
    mediaResponse.records[0].fields.Id
  );
  console.log(`Airtable listing record request: ${JSON.stringify(listingRequest)}`);

  const listingResponse = await sendUpdateAirtableListingRecordRequest(
    listingRequest,
    airtable,
    options
  );
  console.log(`Airtable listing record updated: ${JSON.stringify(listingResponse)}`);
}

try {
  await screenshot();
} catch (error) {
  console.error(error);
  exit(1);
}
