import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import * as fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const snap = await getDocs(collection(db, "products"));
  let count = 0;
  for (const d of snap.docs) {
    const data = d.data();
    if (data.is_active === undefined) {
      await updateDoc(doc(db, "products", d.id), { is_active: true });
      count++;
    }
  }
  console.log(`Updated ${count} products to be active by default.`);
}

run().catch(console.error);
