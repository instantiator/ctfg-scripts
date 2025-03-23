export async function test() {
  console.log("Hello");
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("Sleepyhead");
}

await test();