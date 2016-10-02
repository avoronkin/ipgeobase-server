const geo = require('geotools');
const version = require('../middleware/version');
const validate = require('../middleware/validate');
const meta = require('../middleware/meta').middleware;
const Joi = require('joi');
const routerFactory = require('../Router');

const router = module.exports = routerFactory();

const reqSchema = {
  query: {
    ip: Joi
      .string()
      .required()
      .ip({
        version: ['ipv4'],
      })
      .description('ip param description'),
  },
};

router.get('/',
  meta({
    operationId: 'getLocationByIp',
    path: '/ip',
    description: 'geolocation by ip',
    validate: reqSchema,
    version: '1,2',
  }),
  version(),
  validate(),
  (req, res) => {
    const ip = req.query.ip;
    const result = geo.lookup(ip);

    res.json(result);
  });
