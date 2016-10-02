const version = require('../middleware/version');
// const validate = require('../middleware/validate');
const meta = require('../middleware/meta').middleware;
const Joi = require('joi');
const routerFactory = require('../Router');

const router = module.exports = routerFactory();


router.get('/',
  meta({
    operationId: 'readTest',
    path: '/test',
    description: 'read test description',
    version: '2',
  }),
  version(),
  (req, res) => {
    res.json({
      test: true,
    });
  });

const reqSchema = {
  body: Joi.object()
    .description('dbshdbshdb description')
    .keys({
      ip: Joi.string().required().description('ip param description'),
      test: Joi.string()
        .description('test param description')
        .default('a')
        .valid('b', 'B', 'a', 'd'),
    }),
  path: {
    id: Joi.string()
      .required()
      .description('ID of pet to use'),
  },
};

router.post('/:id',
  meta({
    operationId: 'createTest',
    path: '/test/{id}',
    description: 'create test description',
    validate: reqSchema,
    version: '2',
  }),
  version(),
  (req, res) => {
    res.json({
      test: true,
    });
  });
