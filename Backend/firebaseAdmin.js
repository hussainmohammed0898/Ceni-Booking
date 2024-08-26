import admin from "firebase-admin";
import { admindk } from "./ceni-booking-firebase-adminsdk.js";



admin.initializeApp({
    credential: admin.credential.cert(admindk),
  });

  export default admin;

