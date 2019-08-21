import { getCount } from "./ipl";
import { getData } from "./baeldung";

async function invokeFunction() {
  await getData();
}

invokeFunction();
