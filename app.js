import router from './routers/index.router.js';
import { connect } from './config/database.config.js'; 

const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Permite todas las fuentes
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Métodos permitidos
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Cabeceras permitidas
};

// Config server
const app = (req, res) => {
  try {
    setCorsHeaders(res);
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    router.handle(req, res);
  } catch (error) {
    router.handleError(error, req, res); 
  }
};

// Connect to database
connect();

export default app;
