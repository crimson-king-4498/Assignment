import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3001; 

export default {
  MONGODB_URI,
  PORT
};