import { getCount } from "./ipl";
// import { getData } from "./baeldung";
import { getData } from "./getAverage";

async function invokeFunction() {
  await getData();
}

invokeFunction();
