export interface TechulusSecrets {
  TECHULUS_API_KEY: string;
  TECHULUS_SECRET: string;
}

export interface AwsSecrets {
  AWS_ACCESS_KEY: string;
  AWS_ACCESS_SECRET: string;
}

export interface AirtableSecrets {
  AIRTABLE_TOKEN: string;
}

export interface ScreenshotOptions {
  id: string;
  url: string;
  aws_bucket: string;
  aws_region: string;
  airtable_base: string;
}

export function require(object: any, name: string) {
  if (!object) {
    throw `${name} is not defined`;
  }
}
