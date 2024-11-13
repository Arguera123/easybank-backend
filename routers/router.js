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

    if (req.headers['content-type'] !== 'application/json') {
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

  logRequest(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    const originalEnd = res.end;
    res.end = (chunk, encoding) => {
      console.log(`[${new Date().toISOString()}] Response status: ${res.statusCode}`);
      originalEnd.call(res, chunk, encoding);
    };
    next();
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

    this.logRequest(req, res, () => {
      if (this.routes[method] && this.routes[method][url]) {
      const handlers = this.routes[method][url];

      const executeHandlers = (index = 0) => {
        const handler = handlers[index];
        if (handler) {
          try {
            handler(req, res, (error) => {
              if (error) {
                this.handleError(error, req, res);
              } else {
                executeHandlers(index + 1);
              }
            });
          } catch (error) {
            this.handleError(error, req, res);
          }
        } else {
          res.end();  // Finalizar la respuesta al completar todos los handlers
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
        executeHandlers();  // Ejecutar los handlers incluso en métodos GET o DELETE
      }

    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }

    });
  }

  handleError(err, req, res) {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: message }));
  }
}

export default Router;

