import admin from "firebase-admin";
import ceni from "./ceni-booking-firebase-adminsdk-9o8ll-535306fd65.json" assert { type: 'json' };;


admin.initializeApp({
    credential: admin.credential.cert(ceni),
  });

  export default admin;

