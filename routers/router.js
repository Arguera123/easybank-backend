class Router {
  constructor() {
    this.routes = {
      GET: {},
      POST: {},
      PUT: {},
      DELETE: {}
    };
  }

  parseRequestBody(req, callback) {
    let data = '';

    if(req.headers['content-type'] !== 'application/json') {
      req.body = {};
      return callback();
    }

    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      try {
        const parsedData = JSON.parse(data); 
        req.body = parsedData;              
        callback();                        
      } catch (err) {
        req.body = {};  
        callback(err); 
      }
    });
  }

  // Agregar una ruta con un método y un controlador
  add(method, path, ...handlers) {
    if (!this.routes[method]) {
      throw new Error(`Method ${method} not supported`);
    }

    this.routes[method][path] = handlers;
  }

  use(basePath, subRouter) {
    Object.keys(subRouter.routes).forEach(method => {
      Object.keys(subRouter.routes[method]).forEach(url => {
        this.add(method, `${basePath}${url}`, ...subRouter.routes[method][url]);
      });
    });
  }

  handle(req, res) {
    const { url, method } = req;

    if (this.routes[method] && this.routes[method][url]) {
      const handlers = this.routes[method][url];

      const executeHandlers = (index = 0) => {
        const handler = handlers[index];3
        if (handler) {
          try {
            handler(req, res, () => executeHandlers(index + 1));            
          } catch (error) {
            this.handleError(error, req, res);
          }
        } else {
          res.end(); 
        }
      };

      if (method === 'POST' || method === 'PUT') {
        this.parseRequestBody(req, error => {
          if (error) {
            this.handleError(error, req, res);
          } else {
            executeHandlers();
          }
        });
      } else {
        executeHandlers();
      }

    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  }

  handleError(err, req, res) {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message }));
  }
}

export default Router;

