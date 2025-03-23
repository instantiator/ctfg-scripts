export async function test() {
  console.log("Test workflow...");
  console.log(process.env.CLIENT_PAYLOAD);
}

await test();