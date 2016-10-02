const errorHandler = require('./middleware/errorHandler');
const error404 = require('./middleware/error404');
const queryParser = require('./middleware/queryParser');
const router = require('./routes');
const cors = require('./middleware/cors');

const app = module.exports = require('./Router')();

app.use(queryParser);
app.use(cors());
app.use(router);
app.use('*', error404);
app.use(errorHandler);
