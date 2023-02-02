const leadRouter = require('./leads');
const userRouter = require('./user');


const routesInit = (app) => {
  app.use('/lead', leadRouter);
  app.use('/user', userRouter);
  return app;
};

module.exports = routesInit;
