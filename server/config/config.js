var env = process.env.NODE_ENV || 'DEV'
var config = {};

switch(env){
    case 'DEV':
        config = require('./environment.json');
        break;
    case 'PROD':
        config = require('./environment.json');
        break;
    default:
        config = require('./environment.json');
        break;
}
var envConfig = config;

Object.keys(envConfig).forEach(k => process.env[k] = envConfig[k]);
