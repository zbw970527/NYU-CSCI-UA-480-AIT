// webby.js
const net = require('net');
const fs = require('fs');
const path = require('path');


const HTTP_STATUS_CODES = {
  200: 'OK',
  301: 'Moved Permanently',
  404: 'Not Found',
  500: 'Internal Server Error'
};

const MIME_TYPES = {
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'html': 'text/html',
  'css': 'text/css',
  'txt': 'text/plain'
};

function getExtension(fileName){
  let ext = fileName.split('.');
  if(ext.length == 1){
    return '';
  }
  else{
    return ext[ext.length-1].toLowerCase();
  }
}

function getMIMEType(fileName){
  let ext = MIME_TYPES[getExtension(fileName)];
  if (ext === undefined) {
    return '';
  }
  else {
    return ext;
  }
}

class Request {
  constructor(httpRequest){
    const [method, path, ...notUsed] = httpRequest.split(' ');
    this.method = method;
    this.path = path;
  }

}

class Response {
  constructor(socket, statusCode=200, version="HTTP/1.1") {
    this.sock = socket;
    this.statusCode = statusCode;
    this.version = version;
    this.headers = {};

  }

  set(name, value){
    this.headers[name] = value;
  }

  end(){
    this.sock.end();
  }

  statusLineToString(){
      return this.version + ' ' + this.statusCode +" "+ HTTP_STATUS_CODES[this.statusCode] + '\r\n';
  }

  headersToString(){
    let result = '';
    for (let item in this.headers){
      result = result + item + ': ' + this.headers[item] + '\r\n';
    }
    return result;
  }

  send(body){
    if(this.headers['Content-Type'] === undefined){
      this.set('Content-Type', 'text/html');
    }
    this.sock.write(this.statusLineToString());
    this.sock.write(this.headersToString() + '\r\n');
    this.sock.write(body);
    this.end();
  }

  status(statusCode){
    this.statusCode = statusCode;
    return this;
  }
}

class App {
  constructor(){
    this.server = net.createServer(this.handleConnection.bind(this));
    this.routes = {};
    this.middleware = null;
  }

  normalizePath(path){
    if(path === '/'){
      return '/';
    }
    else{
      let result = path.toLowerCase();
      result = result.match(/[a-z]+/g);
      return '/' + result[0];
    }
  }

  createRouteKey(method, path){
    return (method.toUpperCase() + " " + this.normalizePath(path));
  }

  get(path, cb){
    let route = this.createRouteKey('GET', path);
    this.routes[route] = cb;
  }

  use(cb){
    this.middleware = cb;
  }

  listen(port, host){
    this.server.listen(port, host);
  }

  handleConnection(sock){
    sock.on('data', (binaryData) => {
      this.handleRequest(sock, binaryData);
    });
  }

  handleRequest(sock, binaryData){
    let request = new Request(''+binaryData);
    //console.log(request);
    let response = new Response(sock, this.statusCode);
    //console.log(response);
    if (this.middleware != null) {
      this.middleware(request, response, this.processRoutes(request, response));
    }
    else {
      this.processRoutes(request, response);
    }
  }

  processRoutes(req, res){
    let key = this.createRouteKey(req.method, req.path);
    if(this.routes[key] === undefined){
      res.statusCode = 404;
      res.send("Page not found.");
    }
    else {
      let func = this.routes[key];
      func(req, res);
    }
  }
}

function serveStatic(basePath){
  function mw(req, res, next){
      console.log(req.path);
      let p = path.join(basePath, req.path);
      p = p.replace(/\\/g, '\/');
      console.log('file path is: ' + p);
      let file = undefined;
      fs.readFile(p, function (err, data){
        if (err) {
          //console.log("Error! ", err);
        }
        else {
          //console.log("Did I get here?");
          file = data;
          let ext = req.path.split('.')[1];
          res.set('Content-Type', MIME_TYPES[ext]);
          console.log(res.headers['Content-Type']);
          res.send(file);
          next;
        }
      });

  };
  return mw;
}

module.exports = {
  HTTP_STATUS_CODES: HTTP_STATUS_CODES,
  MIME_TYPES: MIME_TYPES,
  getExtension: getExtension,
  getMIMEType: getMIMEType,
  Request: Request,
  Response: Response,
  App: App,
  static: serveStatic
};
