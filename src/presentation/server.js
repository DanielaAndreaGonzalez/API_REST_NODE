const { Router } = require('express');
const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');



class Server {

  constructor(options) {
    const { port, routes, public_path = 'public' } = options;

    this.app = express();
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }



  async start() {


    //* Middlewares
    this.app.use(express.json()); // raw
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

    // Carga el archivo YAML
    const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));

    // Configura Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    //* Public Folder
    this.app.use(express.static(this.publicPath));

    //* Routes
    this.app.use(this.routes);

    //* SPA
    this.app.get('*', (req, res) => {
      const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
      res.sendFile(indexPath);
    });


    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });

  }

  close() {
    this.serverListener?.close();
  }

}

module.exports = Server;