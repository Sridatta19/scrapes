import { getCount } from "./ipl";
// import { getData } from "./baeldung";
import { getData, processData } from "./getAverage";

async function invokeFunction() {
  // await getData();
  await processData();
}

invokeFunction();
