const admin = require("firebase-admin");
const serviceAccount = require("serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://syncware-tech-alexa-skill.firebaseio.com"
});

const db = admin.firestore();

exports.getSyncwareTechnologiesServices = async () => {
  let services = [];

  const snapshot = await db.collection("services").get();

  snapshot.forEach(doc => {
    if (doc.exists) {
      services.push({
        id: doc.id,
        ...doc.data()
      });
    }
  });

  return services;
};

exports.getPriceForService = async service => {
  let service = null;

  const snapshot = await db
    .collection("services")
    .where("name", "==", service)
    .limit(1)
    .get();

  snapshot.forEach(doc => {
    if (doc.exists) {
      service = {
        id: doc.id,
        ...doc.data()
      };
    }
  });

  if (service) {
    return service.price;
  } else {
    return false;
  }
};
