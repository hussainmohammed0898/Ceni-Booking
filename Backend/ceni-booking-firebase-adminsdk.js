import dotenv from 'dotenv';
dotenv.config();
export const admindk={
  "type": "service_account",
  "project_id": process.env.PROJECT_ID,
  "private_key_id": process.env.RIVATE_KEY_ID,
  "private_key": process.env.PRIVATE_KEY,
  "client_email": process.env.CLINET_EMAIL,
  "client_id": process.env.CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-9o8ll%40ceni-booking.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
