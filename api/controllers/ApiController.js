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

ApiController = {
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
  },

  redundant: async function (model, attribute, value) {
    if (attribute == `path` && value.includes(" ")) {
      return response.back(201, null, `${attribute} cannot be space`);
    } else {
      let err, data, filter = { [attribute] : { "$regex": value.toLowerCase(), "$options": "i"} ,is_delete: false };
      [err, data] = await flatry( model.find( filter ) );
      if (err) {
        return response.back(400, {}, `Error when find in redundant api controller`);
      }
      
      if (data.length > 0) {
        return response.back(201, null, `Data found, cannot same data`);
      } else {
        return response.back(200, null, `data not found`);
      }
    }

  },

  child: async function (req, res) {
    let err, find_c, find, { model, child, attribute } = req.query, data = [];
    let Models = (model == `Tropicalcyclone`) ? Tropicalcyclone : 
      (model == `About`) ? About : 
      (model == `Aftereventreport`) ? Aftereventreport : 
      (model == `Annualreport`) ? Annualreport : 
      (model == `Cyclogenesischecksheet`) ? Cyclogenesischecksheet : 
      (model == `Cyclonecitra`) ? Cyclonecitra : 
      (model == `Cyclonecurrent`) ? Cyclonecurrent : 
      (model == `Cyclonename`) ? Cyclonename : 
      (model == `Cycloneoutlook`) ? Cycloneoutlook : Publication;
    let Childs = (child == `Tropicalcyclone`) ? Tropicalcyclone : 
      (child == `About`) ? About : 
      (child == `Aftereventreport`) ? Aftereventreport : 
      (child == `Annualreport`) ? Annualreport : 
      (child == `Cyclogenesischecksheet`) ? Cyclogenesischecksheet : 
      (child == `Cyclonecitra`) ? Cyclonecitra : 
      (child == `Cyclonecurrent`) ? Cyclonecurrent : 
      (child == `Cyclonename`) ? Cyclonename : 
      (child == `Cycloneoutlook`) ? Cycloneoutlook : Publication;

    [err, find] = await flatry( Models.find( req.body ));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find parent data in api controller`, res, err);
    }
    if (find.length > 0) {
      for (let i = 0 ; i < find.length ; i++) {
        let temp = find[i];
        [err, find_c] = await flatry( Childs.find( {[attribute]: temp._id, is_delete: false} ) );
        if (err) {
          response.error(400, `Error when find child in api controller`, res, err);
        }
        data.push(find_c);
      }

      if (data.length > 0 ) {
        response.ok(data, res, `success get data`);
      } else {
        response.success(data, res, `success get data, but data empty`);
      }
    } else if (find.length == 0) {
      response.error(201, `Data empty`, res, `Data empty`);
    }
  },

  convert: async function(latitude, longitude) {
    function ConvertDMSToDD(degrees, minutes, seconds, direction) {
      let min = parseFloat(minutes/60).toFixed(10);
      let sec = parseFloat(seconds/3600).toFixed(10);
      let dd = parseFloat(degrees) + parseFloat(min) + parseFloat(sec);

      if (direction == "S" || direction == "W") {
        dd = dd * -1;
      }
      return dd;
    }

    let data = {}, 
      lat_parts = latitude.split(/[^\d\w\.]+/),
      long_parts = longitude.split(/[^\d\w\.]+/);

    let lat = (lat_parts.length == 3) ? ConvertDMSToDD(lat_parts[0], lat_parts[1], 0, lat_parts[2]) : ConvertDMSToDD(lat_parts[0], lat_parts[1], lat_parts[2], lat_parts[3]);
    let lng = (long_parts.length == 3) ? ConvertDMSToDD(long_parts[0], long_parts[1], 0, long_parts[2]): ConvertDMSToDD(long_parts[0], long_parts[1], long_parts[2], long_parts[3]);

    data = {
      lat: (lat) ? lat : 0,
      lng: (lng) ? lng : 0
    }
    return response.back(200, data, `convert success`);

  }
};

module.exports = ApiController;