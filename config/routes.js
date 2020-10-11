module.exports = function (app) {
  let About = require('../api/routes/About');
  app.use('/About', About);

  let Aftereventreport = require('../api/routes/Aftereventreport');
  app.use('/Aftereventreport', Aftereventreport);

  let Annualreport = require('../api/routes/Annualreport');
  app.use('/Annualreport', Annualreport);

  let Cyclogenesischecksheet = require('../api/routes/Cyclogenesischecksheet');
  app.use('/Cyclogenesischecksheet', Cyclogenesischecksheet);

  let Cyclonecurrent = require('../api/routes/Cyclonecurrent');
  app.use('/Cyclonecurrent', Cyclonecurrent);

  let Cyclonename = require('../api/routes/Cyclonename');
  app.use('/Cyclonename', Cyclonename);

  let Cyclonenamedescription = require('../api/routes/Cyclonenamedescription');
  app.use('/Cyclonenamedescription', Cyclonenamedescription);

  let Cycloneoutlook = require('../api/routes/Cycloneoutlook');
  app.use('/Cycloneoutlook', Cycloneoutlook);

  let Loginattempt = require('../api/routes/Loginattempt');
  app.use('/Loginattempt', Loginattempt);

  let Logintracker = require('../api/routes/Logintracker');
  app.use('/Logintracker', Logintracker);

  let Publication = require('../api/routes/Publication');
  app.use('/Publication', Publication);

  let Tropicalcyclone = require('../api/routes/Tropicalcyclone');
  app.use('/Tropicalcyclone', Tropicalcyclone);

  let User = require('../api/routes/User');
  app.use('/User', User);

  let Menu = require('../api/routes/Menu');
  app.use('/Menu', Menu);

  let Authentication = require('../api/routes/Authentication');
  app.use('/Authentication', Authentication);
}
