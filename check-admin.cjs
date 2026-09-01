const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = require('./firebase-applet-config.json');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function main() {
  const snap = await getDocs(collection(db, 'admins'));
  console.log("Admins:");
  snap.forEach(doc => {
    console.log(doc.id, "=>", doc.data());
  });
  process.exit(0);
}
main();
