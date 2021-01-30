const About = require('../models/about'),
  Aftereventreport = require('../models/after_event_report'),
  Annualreport = require('../models/annual_report'),
  Cyclogenesischecksheetdetail = require('../models/cyclogenesis_checksheet_detail'),
  Cyclogenesischecksheet = require('../models/cyclogenesis_checksheet'),
  Cyclonecitra = require('../models/cyclone_citra'),
  Cyclonedescription = require('../models/cyclone_description'),
  Cyclonecurrent = require('../models/cyclone_current'),
  Cyclonename = require('../models/cyclone_name'),
  Cycloneoutlook = require('../models/cyclone_outlook'),
  Publication = require('../models/publication'),
  Tropicalcyclone = require('../models/tropical_cyclone'),
  Filecyclone = require('../models/file_cyclone'),
  Fileupload = require('../models/file_upload'),
  key = require('../../config/setting'),
  { Parser, transforms } = require('json2csv'),
  pdf = require('html-pdf');

ApiController = {
  checkHeaders: async function (headers) {
    let today = moment.utc().format(`YYYYMMDDHH`);
    let auth = `${key.secret}${today}`;
    console.log(auth)
    if (headers[`authorization`] == auth) {
      return response.back(200, null, `Authorization Matched`);
    } else {
      return response.back(400, null, `Authorization not Matched`);
    }
  },

  filter: async function (req, res) {
    let err, data = [], { filter, sort, models, select, is_direct_value } = req.body, obj = {};
    let find_data = (Object.entries(filter).length > 0) ? filter : { is_delete: false };
    let sort_data = (sort) ? sort : { created_at : 1 };
    let Model = (models == `Tropicalcyclone`) ? Tropicalcyclone : 
      (models == `About`) ? About : 
      (models == `Aftereventreport`) ? Aftereventreport : 
      (models == `Annualreport`) ? Annualreport : 
      (models == `Cyclogenesischecksheetdetail`) ? Cyclogenesischecksheetdetail : 
      (models == `Cyclogenesischecksheet`) ? Cyclogenesischecksheet : 
      (models == `Cyclonecitra`) ? Cyclonecitra : 
      (models == `Cyclonedescription`) ? Cyclonedescription : 
      (models == `Cyclonecurrent`) ? Cyclonecurrent : 
      (models == `Cyclonename`) ? Cyclonename : 
      (models == `Cycloneoutlook`) ? Cycloneoutlook : 
      (models == `Publication`) ? Publication : null;

    if (Model) {
      [err, find] = await flatry( Model.find(find_data, select).sort(sort_data));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when filter data`, res, err);
      }
      
      if (find.length > 0) {
        for (let i = 0 ; i < find.length ; i++) {
          let temp = find[i];

          //FIND FILE UPLOAD
          let upload = await UploadController.getMultipleFile(models.toLowerCase(), temp._id);
          if (upload.status == 400) {
            return response.error(400, `Error when get all file in api controller`, res, upload.messages);
          }
          
          data.push({
            content: (is_direct_value) ? obj : temp,
            files : (upload.data.length > 0) ? upload.data : null
          });
        }

        if (is_direct_value) {
          select.map((sl) => {
            obj[sl] = [];
          });
          select.map((sl) => {
            find.map(fn => {
              obj[sl].push(fn[sl])
            })
          });
          data = [];
          data.push({ content: obj })
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
    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers cyclonecitra`, res, checkHeaders.message);
    }

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

  redundant: async function (model, attribute, value, same, not_id, method, array) {
    if (attribute == `path` && value.includes(" ")) {
      return response.back(201, null, `${attribute} cannot be space`);
    } else {
      let err, data, filter, temp_filter = {};

      //NEW FEATURE, EXAMPLE IN TROPICAL CYCLONE CREATE
      if (array) {
        for (let i = 0 ; i < attribute.length; i++) {
          let att = attribute[i]
          temp_filter[att.att] = (att.type == `string`) ? {"$regex": `${att.value}$`, $options: "-i"} :
            (att.type == `not-id`) ? { $ne: not_id } : 
            (att.type == `number`) ? parseInt(att.value) : 
            (att.type == `boolean`) ? att.value : null
        }
      }

      if (method == `create`) {
        filter = (array) ? temp_filter : (same) ? { $or: [{[attribute] : value.toLowerCase()}, {[attribute] : value}] , is_delete: false } : 
        { [attribute] : {"$regex": `${value}$`, $options: "-i"}, is_delete: false };
      } else if (method == `update`) {
        filter = (array) ? temp_filter : (same) ? { _id :{ $ne: not_id }, $or: [{[attribute] : value.toLowerCase()}, {[attribute] : value}] , is_delete: false } : 
        { _id :{ $ne: not_id },  [attribute] : {"$regex": `${value}$`, $options: "-i"}, is_delete: false };
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
      (model == `Cyclogenesischecksheetdetail`) ? Cyclogenesischecksheetdetail : 
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
      (child == `Cyclogenesischecksheetdetail`) ? Cyclogenesischecksheetdetail : 
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

  convert: async function(latitude, longitude, type) {
    latitude = parseFloat(latitude).toFixed(10);
    longitude = parseFloat(longitude).toFixed(10);

    function ConvertDDToDMS(D, arah){
      D = Math.abs(D);
      return [0|D, '°', 0|(D<0?D=-D:D)%1*60, "'", 0|D*60%1*60, ` ${arah}`].join('');
    }

    function ConvertDMSToDD(degrees, minutes, seconds, direction) {
      let min = parseFloat(minutes/60).toFixed(10);
      let sec = parseFloat(seconds/3600).toFixed(10);
      let dd = parseFloat(degrees) + parseFloat(min) + parseFloat(sec);

      if (direction == "S" || direction == "W") {
        dd = dd * -1;
      }
      return dd;
    }

    let data = {}, lat, lng,
      lat_parts = (type == `dd`) ? latitude.split(/[^\d\w\.]+/) : latitude.substring(0, latitude.length - 2),
      long_parts = (type == `dd`) ? longitude.split(/[^\d\w\.]+/) : longitude.substring(0, longitude.length - 2);
    
    if (type == `dd`) {
      lat = (lat_parts.length == 3) ? ConvertDMSToDD(lat_parts[0], lat_parts[1], 0, lat_parts[2]) : ConvertDMSToDD(lat_parts[0], lat_parts[1], lat_parts[2], lat_parts[3]);
      lng = (long_parts.length == 3) ? ConvertDMSToDD(long_parts[0], long_parts[1], 0, long_parts[2]): ConvertDMSToDD(long_parts[0], long_parts[1], long_parts[2], long_parts[3]);
    } else if (type == `dms`) {
      let lat_arah = (latitude.substring(latitude.length-2, latitude.length) == 'LS' || latitude < 0) ? `S` : `N`;
      let long_arah = (longitude.substring(longitude.length-2, longitude.length) == `BT` || longitude > 0) ? `E` : `W`;
      lat = ConvertDDToDMS(lat_parts, lat_arah);
      lng = ConvertDDToDMS(long_parts, long_arah);
    }

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
          data.status = 400; data.msg = `Error when create html`;
          rejects(data)
        }
        data.data = res;
        resolve(data)
      });
    });
  },

  generateCSV: async function(data_csv, fields, path, transforms) {
    return new Promise(async (resolve, rejects) => {
      let random = Math.floor((Math.random() * 100) + 1),
        today = moment.utc().format(`YYYYMMDDHHMMSS`);

      let name = `${path}-${today}${random}`;
      let json2csvParser = (transforms) ? new Parser({fields, transforms}) : new Parser({fields});
      let csv = json2csvParser.parse(data_csv);
      let data = { status: 200, data: {}, message: `Success create CSV File` }
      fs.writeFile(`./files/csv/${path}/${name}.csv`, csv, function(err) {
        if (err) {
          console.log(err);
          data.status = 400; data.msg = `Error when create html`;
          rejects(data)
        }
        data.data.csv = csv;
        data.data.name = `${name}.csv`;
        data.data.path = `/files/csv/${path}/${name}.csv`;
        resolve(data)
      });
    });
  },

  getChildFromParent: async function (models, model_id, parent, attribute, extra_populate) {
    let err, find;
    let Model = (models == `Tropicalcyclone`) ? Tropicalcyclone : 
      (models == `About`) ? About : 
      (models == `Aftereventreport`) ? Aftereventreport : 
      (models == `Annualreport`) ? Annualreport : 
      (models == `Cyclogenesischecksheetdetail`) ? Cyclogenesischecksheetdetail : 
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
      (parent == `cyclogenesischecksheetdetail`) ? {cyclogenesis_checksheet_detail_id: model_id, is_delete: false} :
      (parent == `cyclogenesischecksheet`) ? {cyclogenesis_checksheet_id: model_id, is_delete: false} :
      (parent == `cyclonecitra`) ? {cyclone_citra_id: model_id, is_delete: false} :
      (parent == `publication`) ? {publication_id: model_id, is_delete: false} : {is_delete: false};

    let parent_attribute = (extra_populate) ? extra_populate : 
      (parent == `tropicalcyclone`) ? `tropical_cyclone_id` :
      (parent == `annualreport`) ? `annual_report_id` :
      (parent == `aftereventreport`) ? `after_event_report_id` :
      (parent == `cycloneoutlook`) ? `cyclone_outlook_id` :
      (parent == `about`) ? `about_id` :
      (parent == `cyclogenesischecksheetdetail`) ? `cyclogenesis_checksheet_detail_id` :
      (parent == `cyclogenesischecksheet`) ? `cyclogenesis_checksheet_id` :
      (parent == `cyclonecitra`) ? `cyclone_citra_id` :
      (parent == `publication`) ? `publication_id` : null;
      

    if (Model && old) {
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
      return response.back(400, null,`Error with Model's name or old's name or empty`);
    }
    
  },

  getChildFromParent2: async function (child, parent, parent_body, view_parent, parent_att) {
    let err, find_parent, find_child, obj = [], child_data = [];
    let Childmodel = (child == `Tropicalcyclone`) ? Tropicalcyclone : 
      (child == `About`) ? About : 
      (child == `Aftereventreport`) ? Aftereventreport : 
      (child == `Annualreport`) ? Annualreport : 
      (child == `Cyclogenesischecksheetdetail`) ? Cyclogenesischecksheetdetail : 
      (child == `Cyclogenesischecksheet`) ? Cyclogenesischecksheet : 
      (child == `Cyclonecitra`) ? Cyclonecitra : 
      (child == `Cyclonedescription`) ? Cyclonedescription : 
      (child == `Cyclonecurrent`) ? Cyclonecurrent : 
      (child == `Cyclonename`) ? Cyclonename : 
      (child == `Cycloneoutlook`) ? Cycloneoutlook : 
      (child == `Publication`) ? Publication : null;

    let Parentmodel = (parent == `tropicalcyclone`) ? Tropicalcyclone : 
      (parent == `about`) ? About : 
      (parent == `aftereventreport`) ? Aftereventreport : 
      (parent == `annualreport`) ? Annualreport : 
      (parent == `cyclogenesischecksheetdetail`) ? Cyclogenesischecksheetdetail : 
      (parent == `cyclogenesischecksheet`) ? Cyclogenesischecksheet : 
      (parent == `cyclonecitra`) ? Cyclonecitra : 
      (parent == `cyclonedescription`) ? Cyclonedescription : 
      (parent == `cyclonecurrent`) ? Cyclonecurrent : 
      (parent == `cyclonename`) ? Cyclonename : 
      (parent == `cycloneoutlook`) ? Cycloneoutlook : 
      (parent == `publication`) ? Publication : null;

    if (Parentmodel && Childmodel && parent_body && parent_att) {
      [err, find_parent] = await flatry(Parentmodel.find(parent_body, view_parent));
      if (err) {
        return response.back(400, {}, err.stack);
      }

      if (find_parent.length > 0) {
        for (let i = 0; i < find_parent.length ; i++) {
          child_data = [];
          let temp = find_parent[i];
          [err, find_child] = await flatry(Childmodel.find({ [parent_att]: temp._id, is_delete: false }));
          if (err) {
            return response.back(400, {}, err.stack);
          }
          child_data.push(find_child);
          obj.push({
            parent: temp,
            child: child_data[0]
          })
        }

        return response.back(200, obj, `Success get child data`);
      } else {
        return response.back(201, null, `Success but empty data`);
      }
    } else {
      return response.back(400, null, `Data not complete`);
    }

  },

  getChildToDelete : async function (models, model_id, parent) {
    let err, find;
    let Model = (models == `Tropicalcyclone`) ? Tropicalcyclone : 
      (models == `About`) ? About : 
      (models == `Aftereventreport`) ? Aftereventreport : 
      (models == `Annualreport`) ? Annualreport : 
      (models == `Cyclogenesischecksheetdetail`) ? Cyclogenesischecksheetdetail : 
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
      (parent == `cyclogenesischecksheetdetail`) ? {cyclogenesis_checksheet_detail_id: model_id, is_delete: false} :
      (parent == `cyclogenesischecksheet`) ? {cyclogenesis_checksheet_id: model_id, is_delete: false} :
      (parent == `cyclonecitra`) ? {cyclone_citra_id: model_id, is_delete: false} :
      (parent == `publication`) ? {publication_id: model_id, is_delete: false} : null;

    let new_data = { is_delete: true };

    if (Model && old) {
      [err, find] = await flatry( Model.updateMany( old, new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        return response.back(400, {}, err.stack);
      } 
      return response.back(200, find, `Success delete child data`);
    } else {
      return response.back(400, null,`Error with Model's name or old's name or empty`);
    }
  },

  cuChildAndParent: async function (child, parent_id, parent, parent_data, child_data, to_do, filter_child) {
    let err, data_parent, data_child, data = {}, filter, today = moment().format(`YYYY-MM-DDTHH:mm:ss.SSSZ`);
    let Child = (child == `Tropicalcyclone`) ? Tropicalcyclone : 
      (child == `About`) ? About : 
      (child == `Aftereventreport`) ? Aftereventreport : 
      (child == `Annualreport`) ? Annualreport : 
      (child == `Cyclogenesischecksheetdetail`) ? Cyclogenesischecksheetdetail : 
      (child == `Cyclogenesischecksheet`) ? Cyclogenesischecksheet : 
      (child == `Cyclonecitra`) ? Cyclonecitra : 
      (child == `Cyclonedescription`) ? Cyclonedescription : 
      (child == `Cyclonecurrent`) ? Cyclonecurrent : 
      (child == `Cyclonename`) ? Cyclonename : 
      (child == `Cycloneoutlook`) ? Cycloneoutlook : 
      (child == `Publication`) ? Publication : null;
    let Parent = (parent == `tropicalcyclone`) ? Tropicalcyclone :
      (parent == `annualreport`) ? Annualreport :
      (parent == `aftereventreport`) ? Aftereventreport :
      (parent == `cycloneoutlook`) ? Cycloneoutlook :
      (parent == `about`) ? About :
      (parent == `cyclogenesischecksheetdetail`) ? Cyclogenesischecksheetdetail :
      (parent == `cyclogenesischecksheet`) ? Cyclogenesischecksheet :
      (parent == `cyclonecitra`) ? Cyclonecitra :
      (parent == `publication`) ? Publication : null;
    let parent_fk = (parent == `tropicalcyclone`) ? `tropical_cyclone_id` :
      (parent == `annualreport`) ? `annual_report_id` :
      (parent == `aftereventreport`) ? `after_event_report_id` :
      (parent == `cycloneoutlook`) ? `cyclone_outlook_id` :
      (parent == `about`) ? `about_id` :
      (parent == `cyclogenesischecksheetdetail`) ? `cyclogenesis_checksheet_detail_id` :
      (parent == `cyclogenesischecksheet`) ? `cyclogenesis_checksheet_id` :
      (parent == `cyclonecitra`) ? `cyclone_citra_id` :
      (parent == `publication`) ? `publication_id` : null;
    
    if (Child && Parent && parent_fk) {
      if (to_do == `create`) {
        [err, data_parent] = await flatry( Parent.create( parent_data ));
        if (err) {
          console.log(err.stack);
          return response.back(400, {}, err.stack);
        } 
  
        child_data[parent_fk] = data_parent._id;
        [err, data_child] = await flatry( Child.create( child_data ));
        if (err) {
          console.log(err.stack);
          return response.back(400, {}, err.stack);
        } 
      } else if (to_do == `update`) {
        let old = { _id : parent_id, is_delete: false };
        parent_data.modified_at = today;
        [err, data_parent] = await flatry( Parent.findOneAndUpdate( old, parent_data, {new: true}));
        if (err) {
          console.log(err.stack);
          return response.back(400, {}, err.stack);
        }
        
        //FILTER : TO FIND THE SAME DATA IN CHILD, CONTENT SAME ATTRIBUTE IN DB 
        filter_child[parent_fk] = data_parent._id;
        [err, filter] = await flatry( Child.find( filter_child ));
        if (err) {
          console.log(err.stack);
          return response.back(400, {}, err.stack);
        } 

        if (filter.length == 0) {
          child_data[parent_fk] = data_parent._id;
          [err, data_child] = await flatry( Child.create( child_data ));
          if (err) {
            console.log(err.stack);
            return response.back(400, {}, err.stack);
          } 
        } else {
          console.log(`Same child's data`);
        }
      }
      data = {
        parent: data_parent,
        child: data_child
      }
      return response.back(200, data, `Success create or update child data`);
    } else {
      return response.back(400, null,`Error with Model's name or old's name or empty`);
    }
  },

  existFileCyclone: async function () {
    let err, data = [], find, 
      file = {
        name: null,
        arr_file: [],
        not_exist: []
      };
      
    [err, find] = await flatry( Filecyclone.find({ is_delete: false }) );
    if (err || find.length == 0) {
      return response.back(400, {}, `Error when find in exist file cyclone api controller or empty file`);
    }

    for (let i = 0 ; i < find.length; i++) {
      let temp = find[i];
      let exist = await fse.pathExists(`files/tc_module/${temp.name}.txt`);
      if (exist) {
        file.name = temp.name;
        for (let j = 0; j < temp.arr_file.length ; j++) {
          let temp_j = temp.arr_file[j];
          let sub_exist = await fse.pathExists(`files/tc_module/${temp_j.file}.txt`);
          if (!sub_exist) {
            file.not_exist.push(temp_j);
          } else {
            file.arr_file.push(temp_j);
          }
        }
        data.push(file);
      }
      file = {
        name: null,
        arr_file: [],
        not_exist: []
      }
    }

    if (data.length > 0) {
      return response.back(200, data, `Data found`);
    } else if (data.length == 0) {
      return response.back(400, {}, `Empty file in the folder`);
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
          {list_b : {$regex: keyword, $options: "-i"}},
          {year : {$regex: keyword, $options: "-i"}}
        ],
        is_delete: false
       }, `tc_name area en_title id_title list_a list_b path year`) );
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
  },

  deleteData: async function (path, model_id, models) {
    let Model = (models == `Tropicalcyclone`) ? Tropicalcyclone : 
      (models == `About`) ? About : 
      (models == `Aftereventreport`) ? Aftereventreport : 
      (models == `Annualreport`) ? Annualreport : 
      (models == `Cyclogenesischecksheetdetail`) ? Cyclogenesischecksheetdetail : 
      (models == `Cyclogenesischecksheet`) ? Cyclogenesischecksheet : 
      (models == `Cyclonecitra`) ? Cyclonecitra : 
      (models == `Cyclonedescription`) ? Cyclonedescription : 
      (models == `Cyclonecurrent`) ? Cyclonecurrent : 
      (models == `Cyclonename`) ? Cyclonename : 
      (models == `Fileupload`) ? Fileupload : 
      (models == `Cycloneoutlook`) ? Cycloneoutlook : 
      (models == `Publication`) ? Publication : null;

    let filter = (path == `techincal_bulletin_file`) ? {techincal_bulletin_id: model_id, is_delete: false} : 
      (path == `public_info_bulletin_file`) ? {public_info_bulletin_id: model_id, is_delete: false} : 
      (path == `ocean_gale_storm_warn_file`) ? {ocean_gale_storm_warn_id: model_id, is_delete: false} : 
      (path == `track_impact_file`) ? {track_impact_id: model_id, is_delete: false} : 
      (path == `coastal_zone_file`) ? {coastal_zone_id: model_id, is_delete: false} : 
      (path == `extreme_weather_file`) ? {extreme_weather_id: model_id, is_delete: false} : 
      (path == `gale_warning_file`) ? {gale_warning_id: model_id, is_delete: false} : 
      (path == `annualreport`) ? {annual_report_id: model_id, is_delete: false} : 
      (path == `aftereventreport`) ? {after_event_report_id: model_id, is_delete: false} : 
      (path == `thumbnail_after_event_report_file`) ? {thumbnail_after_event_report_id: model_id, is_delete: false} : 
      (path == `thumbnail_publication_file`) ? {thumbnail_publication_id: model_id, is_delete: false} : 
      (path == `cycloneoutlook`) ? {cyclone_outlook_id: model_id, is_delete: false} : 
      (path == `tropicalcyclone`) ? {tropical_cyclone_id: model_id, is_delete: false} : 
      (path == `about`) ? {about_id: model_id, is_delete: false} : 
      (path == `cyclogenesischecksheetdetail`) ? {cyclogenesis_checksheet_detail_id: model_id, is_delete: false} : 
      (path == `cyclogenesischecksheet`) ? {cyclogenesis_checksheet_id: model_id, is_delete: false} : 
      (path == `cyclonecitra`) ? {cyclone_citra_id: model_id, is_delete: false} : 
      (path == `publication`) ? {publication_id: model_id, is_delete: false} : null;
    new_data = {is_delete: true};

    if (filter && Model) {
      let [err] = await flatry( Model.updateMany( filter, new_data ));
      if (err) {
        return response.back(400, {}, err.stack);
      }
      return response.back(200, null, `Success delete data`);
    } else {
      return response.back(400, {}, `Data is empty`);
    }
  }
};

module.exports = ApiController;
