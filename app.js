import router from './routers/index.router.js';
import { connect } from './config/database.config.js'; 

// Config server
const app = (req, res) => {
  try {
    router.handle(req, res);
  } catch (error) {
    
  }
};

// Connect to database
connect();

export default app;
