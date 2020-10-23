const About = require('../models/about'),
 Aftereventreport = require('../models/after_event_report'),
 Annualreport = require('../models/annual_report'),
 Cyclogenesischecksheet = require('../models/cyclogenesis_checksheet'),
 Cyclonecitra = require('../models/cyclone_citra'),
 Cyclonecurrent = require('../models/cyclone_current'),
 Cyclonename = require('../models/cyclone_name'),
 Cycloneoutlook = require('../models/cyclone_outlook'),
 Publication = require('../models/publication'),
 Tropicalcyclone = require('../models/tropical_cyclone');

AboutController = {
  filter: async function (req, res) {
    let err, data, { filter, sort, models } = req.body;
    let find_data = (Object.entries(filter).length > 0) ? filter : { is_delete: false };
    let sort_data = (sort) ? sort : { created_at : 1 };
    let Model = (models == `Tropicalcyclone`) ? Tropicalcyclone : 
      (models == `About`) ? About : 
      (models == `Aftereventreport`) ? Aftereventreport : 
      (models == `Annualreport`) ? Annualreport : 
      (models == `Cyclogenesischecksheet`) ? Cyclogenesischecksheet : 
      (models == `Cyclonecitra`) ? Cyclonecitra : 
      (models == `Cyclonecurrent`) ? Cyclonecurrent : 
      (models == `Cyclonename`) ? Cyclonename : 
      (models == `Cycloneoutlook`) ? Cycloneoutlook : Publication;

    [err, data] = await flatry( Model.find(find_data).sort(sort_data));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when filter data`, res, err);
    }

    response.ok(data, res, `success get filter data`);
  },
  
  last: async function (req, res) {
    let err, data, find_t, find_c, filter = { is_delete: false }, sort = { modified_at: -1 };
    [err, find_t] = await flatry( Tropicalcyclone.findOne( filter ).sort( sort ) );
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when filter data`, res, err);
    }

    [err, find_c] = await flatry( Cyclonecurrent.findOne( filter ).populate(`tropical_cyclone_id`).sort( sort ) );
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when filter data`, res, err);
    }

    let date_1 = moment(find_t.modified_at)
    let date_2 = moment(find_c.modified_at)
    data = (date_1.isSameOrAfter(date_2)) ? find_t : find_c;

    response.ok(data, res, `success get filter data`);
  }
};

module.exports = AboutController;

