module.exports = function (app) {
  let About = require('../api/routes/About');
  app.use('/About', About);

  let Aftereventreport = require('../api/routes/Aftereventreport');
  app.use('/Aftereventreport', Aftereventreport);

  let Annualreport = require('../api/routes/Annualreport');
  app.use('/Annualreport', Annualreport);

  let Cyclogenesischecksheet = require('../api/routes/Cyclogenesischecksheet');
  app.use('/Cyclogenesischecksheet', Cyclogenesischecksheet);

  let Cyclogenesischecksheetdate = require('../api/routes/Cyclogenesischecksheetdate');
  app.use('/Cyclogenesischecksheetdate', Cyclogenesischecksheetdate);

  let Dateform = require('../api/routes/Dateform');
  app.use('/Dateform', Dateform);

  let Cyclonecurrent = require('../api/routes/Cyclonecurrent');
  app.use('/Cyclonecurrent', Cyclonecurrent);

  let Cyclonecitra = require('../api/routes/Cyclonecitra');
  app.use('/Cyclonecitra', Cyclonecitra);

  let Cyclonename = require('../api/routes/Cyclonename');
  app.use('/Cyclonename', Cyclonename);

  let Cyclonedescription = require('../api/routes/Cyclonedescription');
  app.use('/Cyclonedescription', Cyclonedescription);

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

  let Api = require('../api/routes/Api');
  app.use('/api', Api);
}
