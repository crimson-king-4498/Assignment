import 'dotenv/config'; // Ensures environment variables are loaded if .env is present

// Access environment variables, prioritizing Vercel's deployed env over local .env
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3001; // Should use the Vercel assigned port if available

// Check if we are running in a production-like environment (Vercel)
// const NODE_ENV = process.env.NODE_ENV || 'development';

// if (!MONGODB_URI && NODE_ENV !== 'test') {
//     // This console log will appear in the Vercel logs if the variable is missing
//     console.error('FATAL ERROR: MONGODB_URI is not set in environment variables.');
// }

export default {
  MONGODB_URI,
  PORT
};