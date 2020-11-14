const About = require('../models/about'),
  Aftereventreport = require('../models/after_event_report'),
  Annualreport = require('../models/annual_report'),
  Cyclogenesischecksheet = require('../models/cyclogenesis_checksheet'),
  Cyclonecitra = require('../models/cyclone_citra'),
  Cyclonedescription = require('../models/cyclone_description'),
  Cyclonecurrent = require('../models/cyclone_current'),
  Cyclonename = require('../models/cyclone_name'),
  Cycloneoutlook = require('../models/cyclone_outlook'),
  Publication = require('../models/publication'),
  Tropicalcyclone = require('../models/tropical_cyclone'),
  pdf = require('html-pdf');

ApiController = {
  filter: async function (req, res) {
    let err, data = [], { filter, sort, models } = req.body;
    let find_data = (Object.entries(filter).length > 0) ? filter : { is_delete: false };
    let sort_data = (sort) ? sort : { created_at : 1 };
    let Model = (models == `Tropicalcyclone`) ? Tropicalcyclone : 
      (models == `About`) ? About : 
      (models == `Aftereventreport`) ? Aftereventreport : 
      (models == `Annualreport`) ? Annualreport : 
      (models == `Cyclogenesischecksheet`) ? Cyclogenesischecksheet : 
      (models == `Cyclonecitra`) ? Cyclonecitra : 
      (models == `Cyclonedescription`) ? Cyclonedescription : 
      (models == `Cyclonecurrent`) ? Cyclonecurrent : 
      (models == `Cyclonename`) ? Cyclonename : 
      (models == `Cycloneoutlook`) ? Cycloneoutlook : 
      (models == `Publication`) ? Publication : null;

    if (Model) {
      [err, find] = await flatry( Model.find(find_data).sort(sort_data));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when filter data`, res, err);
      }
      
      if (find.length > 0) {
        for (let i = 0 ; i < find.length ; i++) {
          let temp = find[i];
          //FIND FILE UPLOAD
          let upload = await UploadController.getFile(models.toLowerCase(), temp._id);
          if (upload.status == 400) {
            response.error(400, `Error when get all file in api controller`, res, upload.messages);
          }
          
          if (upload.status == 200) {
            data.push({
              content: temp,
              file_name: (upload.data) ? upload.data.name : null,
              file_path: (upload.data) ? upload.data.path: null,
              file_type: (upload.data) ? upload.data.type: null
            });
          }
        }
        
        response.ok(data, res, `success get filter data`);
      } else {
        response.success(null, res, `success get filter data, but no data`);
      }
    } else {
      response.error(400, `Error with Model's name`, res, `Error with Model's name`);
    }
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

  redundant: async function (model, attribute, value, same, not_id, method) {
    if (attribute == `path` && value.includes(" ")) {
      return response.back(201, null, `${attribute} cannot be space`);
    } else {
      let err, data, filter;
      if (method == `create`) {
        filter = (same) ? { $or: [{[attribute] : value.toLowerCase()}, {[attribute] : value}] , is_delete: false } : 
        { $or: [{[attribute] : { "$regex": value.toLowerCase(), "$options": "i"}}, {[attribute] : { "$regex": value, "$options": "i"}}] ,is_delete: false };
      } else if (method == `update`) {
        filter = (same) ? { _id :{ $ne: not_id }, $or: [{[attribute] : value.toLowerCase()}, {[attribute] : value}] , is_delete: false } : 
        { _id :{ $ne: not_id }, $or: [{[attribute] : { "$regex": value.toLowerCase(), "$options": "i"}}, {[attribute] : { "$regex": value, "$options": "i"}}] ,is_delete: false };
      }
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
      (model == `Cyclonedescription`) ? Cyclonedescription : 
      (model == `Cycloneoutlook`) ? Cycloneoutlook :
      (model == `Publication`) ? Publication : null;

    let Childs = (child == `Tropicalcyclone`) ? Tropicalcyclone : 
      (child == `About`) ? About : 
      (child == `Aftereventreport`) ? Aftereventreport : 
      (child == `Annualreport`) ? Annualreport : 
      (child == `Cyclogenesischecksheet`) ? Cyclogenesischecksheet : 
      (child == `Cyclonecitra`) ? Cyclonecitra : 
      (child == `Cyclonecurrent`) ? Cyclonecurrent : 
      (child == `Cyclonename`) ? Cyclonename : 
      (child == `Cyclonedescription`) ? Cyclonedescription : 
      (child == `Cycloneoutlook`) ? Cycloneoutlook :
      (child == `Publication`) ? Publication : null;

    if (Models && Childs) {
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
    } else {
      response.error(400, `Error with Model's name or Child's name`, res, `Error with Model's name or Child's name`);
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

  },

  generated: async function(model, attribute, string) {
    let str = string.replace(/\s+/g, '-').toLowerCase(), redundant;
    let temp = str;

    for (let i = 1 ; i < Infinity; i++) {
      redundant = await ApiController.redundant(model, attribute, str, true, null, `create`);
      if (redundant.status == 201) {
        str = `${temp}-${i}`
      } else {
        break;
      }
    }

    return response.back(200, str, `${str} generated`);
  },

  generatePDF: async function(html, path, name) {
    return new Promise(async (resolve, rejects) => {
      let data = { status: 200, data: null, message: `Success create PDF` }
      let options = { format: 'Letter' };
      await pdf.create(html, options).toFile(`files/pdf/${path}/${name}.pdf`, function(err, res) {
        if (err) {
          console.log(err);
          data.code = 400; data.msg = `Error when create html`;
          rejects(data)
        }
        data.data = res;
        resolve(data)
      });
    });
  },

  getChildFromParent: async function (models, model_id, parent, attribute) {
    let err, find;
    let Model = (models == `Tropicalcyclone`) ? Tropicalcyclone : 
      (models == `About`) ? About : 
      (models == `Aftereventreport`) ? Aftereventreport : 
      (models == `Annualreport`) ? Annualreport : 
      (models == `Cyclogenesischecksheet`) ? Cyclogenesischecksheet : 
      (models == `Cyclonecitra`) ? Cyclonecitra : 
      (models == `Cyclonedescription`) ? Cyclonedescription : 
      (models == `Cyclonecurrent`) ? Cyclonecurrent : 
      (models == `Cyclonename`) ? Cyclonename : 
      (models == `Cycloneoutlook`) ? Cycloneoutlook : 
      (models == `Publication`) ? Publication : null;

    let old = (parent == `tropicalcyclone`) ? {tropical_cyclone_id: model_id, is_delete: false} :
      (parent == `annualreport`) ? {annual_report_id: model_id, is_delete: false} :
      (parent == `aftereventreport`) ? {after_event_report_id: model_id, is_delete: false} :
      (parent == `cycloneoutlook`) ? {cyclone_outlook_id: model_id, is_delete: false} :
      (parent == `about`) ? {about_id: model_id, is_delete: false} :
      (parent == `cyclogenesischecksheet`) ? {cyclogenesis_checksheet_id: model_id, is_delete: false} :
      (parent == `cyclonecitra`) ? {cyclone_citra_id: model_id, is_delete: false} :
      (parent == `publication`) ? {publication_id: model_id, is_delete: false} : null;

    let parent_attribute = (parent == `tropicalcyclone`) ? `tropical_cyclone_id` :
      (parent == `annualreport`) ? `annual_report_id` :
      (parent == `aftereventreport`) ? `after_event_report_id` :
      (parent == `cycloneoutlook`) ? `cyclone_outlook_id` :
      (parent == `about`) ? `about_id` :
      (parent == `cyclogenesischecksheet`) ? `cyclogenesis_checksheet_id` :
      (parent == `cyclonecitra`) ? `cyclone_citra_id` :
      (parent == `publication`) ? `publication_id` : null;
      

    if (Model) {
      [err, find] = await flatry( Model.find( old , attribute ).populate(parent_attribute));
      if (err) {
        console.log(err.stack);
        return response.back(400, {}, err.stack);
      }

      if (find.length > 0) {
        return response.back(200, find, `Success get child data`);
      } else if (find.length == 0) {
        return response.back(201, {}, `Success get all data but data is empty`);
      }
    } else {
      response.error(400, `Error with Model's name`, res, `Error with Model's name`);
    }
    
  },

  search: async function (req, res) {
    let Model = [About, Aftereventreport, Annualreport, Cyclonename, Publication, Tropicalcyclone];
    let data = [], err, find, { keyword } = req.body, models;

    for (let i = 0; i < Model.length; i++) {
      let Temp = Model[i];
      [err, find] = await flatry( Temp.find({ 
        $or: [
          {en_title : {$regex: keyword, $options: "-i"}},
          {id_title : {$regex: keyword, $options: "-i"}},
          {tc_name : {$regex: keyword, $options: "-i"}},
          {area : {$regex: keyword, $options: "-i"}},
          {path : {$regex: keyword, $options: "-i"}},
          {list_a : {$regex: keyword, $options: "-i"}},
          {list_b : {$regex: keyword, $options: "-i"}}
        ],
        is_delete: false
       }, `tc_name area en_title id_title list_a list_b path`) );
       if (err) {
        response.error(400, `Error when find data in search api controller`, res, err);
       }

       if (find.length > 0) {
        models = (Temp == About) ? `About` : 
          (Temp == Aftereventreport) ? `Aftereventreport` : 
          (Temp == Annualreport) ? `Annualreport` : 
          (Temp == Cyclonename) ? `Cyclonename` : 
          (Temp == Publication) ? `Publication` : 
          (Temp == Tropicalcyclone) ? `Tropicalcyclone` : null;

        data.push ({  
          [models] : find
        })
       }
    }
    response.ok(data, res, `success search data`);
  }
};

module.exports = ApiController;
