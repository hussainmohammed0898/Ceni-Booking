import dotenv from 'dotenv';


dotenv.config();

export default {
    port : process.env.PORT || 3000,
    db : process.env.DB_URL || "",
    token: process.env.TOKEN_KEY,
    ownerToken: process.env.OWNER_TOKEN_KEY,
    adminToken : process.env.ADMIN_TOKEN_KEY,
    service: process.env.EMAIL_SERVICE,
    email: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS
}