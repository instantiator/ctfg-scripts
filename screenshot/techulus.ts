import fs from "fs";
import md5 from "md5";
import { Readable } from "stream";
import { TechulusSecrets } from "./config";
import { TECHULUS_API_URL } from "./constants";

export function genTechulusUrl(url: string, techulus: TechulusSecrets): string {
  const params = `url=${url}&delay=5`;
  const hash = md5(`${techulus.TECHULUS_SECRET}${params}`);
  return `${TECHULUS_API_URL}/${techulus.TECHULUS_API_KEY}/${hash}/image?${params}`;
}

export async function download(url: string, dir: string): Promise<string> {
  if (!fs.existsSync(dir)) {
    await fs.mkdir(dir, (err) => {
      if (err) throw err;
    });
  }

  const filename = crypto.randomUUID() + ".jpg";
  const destination = `${dir}/${filename}`;

  const response = await fetch(url);
  const fileStream = fs.createWriteStream(destination);
  await new Promise<void>((resolve, reject) => {
    fileStream.on("error", reject);
    fileStream.on("finish", resolve);
    //@ts-ignore
    Readable.fromWeb(response.body).pipe(fileStream);
  });

  return destination;
}
