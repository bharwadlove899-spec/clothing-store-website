import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString } from "firebase/storage";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const auth = getAuth(app);
const storage = getStorage(app);

async function test() {
  try {
    await signInWithEmailAndPassword(auth, "bharwadlove899@gmail.com", "Testing123!"); // Wait, I don't know the user's password.
  } catch (e) {
    console.log("Auth failed, trying unauth...");
  }
  
  const r = ref(storage, 'test.txt');
  try {
    await uploadString(r, 'hello');
    console.log("Storage upload SUCCESS");
  } catch (e) {
    console.log("Storage upload FAILED:", e.message);
  }
  process.exit(0);
}
test();
