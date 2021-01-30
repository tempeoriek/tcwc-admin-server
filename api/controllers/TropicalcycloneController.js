const Model = require('../models/tropical_cyclone'),
  UploadController = require('./UploadController'),
  ApiController = require('./ApiController'),
  { transforms: { unwind } } = require('json2csv'),
  file_path = `tropicalcyclone`;

TropicalcycloneController = {
  csv: async function (req, res) {
    let obj_parent = [], obj_child = [],
    fields = [
      { value: 'tc_name', label: 'TC Name'},
      { value: 'month', label: 'Month'},
      { value: 'year', label: 'Year'},
      { value: 'area', label: 'Area'},
      { value: 'coordinates.datetime', label: 'Coordinates Datetime'},
      { value: 'coordinates.longitude', label: 'Coordinates Longitude'},
      { value: 'coordinates.latitude', label: 'Coordinates Latitude'},
      { value: 'coordinates.pressure', label: 'Coordinates Pressure'},
      { value: 'coordinates.max_wind_speed', label: 'Coordinates Maxwind'}
    ];
    
    let transforms = [unwind({ paths: ['coordinates'] })];
     
    let child = await ApiController.getChildFromParent2(`Cyclonecurrent`, file_path, {is_delete: false}, `tc_name month year area`, `tropical_cyclone_id`);
    if (child.status == 400) {
     return response.error(400, child.message, res, child.message);
    }

    if (child.status == 200) {
      for (let i = 0; i < child.data.length; i++) {
        let temp = child.data[i];
        if (temp.child.length > 0) {
          for (let k = 0; k < temp.child.length; k++) {
            let tempk = temp.child[k];
            obj_child.push({
              datetime: (tempk.datetime) ? moment(tempk.datetime).format(`DD-MM-YYYY T HH:mm:ss.SSSZ`) : `-`,
              longitude: (tempk.longitude_dd) ? tempk.longitude_dd : `-`,
              latitude: (tempk.latitude_dd) ? tempk.latitude_dd : `-`,
              pressure: (tempk.pressure) ? tempk.pressure : `-`,
              max_wind_speed: (tempk.max_wind_speed) ? tempk.max_wind_speed : `-`,
            })
          }
          obj_parent.push({
            area: (temp.parent.area) ? temp.parent.area : `-`,
            tc_name: (temp.parent.tc_name) ? temp.parent.tc_name : `-`,
            month: (temp.parent.month) ? temp.parent.month : `-`,
            year: (temp.parent.year) ? temp.parent.year : `-`,
            coordinates: obj_child,
          })
        } else {
          obj_child.push({
            datetime: `-`,
            longitude: `-`,
            latitude: `-`,
            pressure: `-`,
            max_wind_speed: `-`,
          });
  
          obj_parent.push({
            area: (temp.parent.area) ? temp.parent.area : `-`,
            tc_name: (temp.parent.tc_name) ? temp.parent.tc_name : `-`,
            month: (temp.parent.month) ? temp.parent.month : `-`,
            year: (temp.parent.year) ? temp.parent.year : `-`,
            coordinates: obj_child,
          })
        }
      }

      let create_csv = await ApiController.generateCSV(obj_parent, fields, file_path, transforms)
      if (create_csv.status == 400) {
        return response.error(400, `Error when create csv`, res, create_csv.message);
      }

      let obj = { name: create_csv.data.name, path: create_csv.data.path, type: `csv`}
      let upload = await UploadController.createExternalFile(obj, null, null, `create`)
      if (upload.status == 400) {
        return response.error(400, `Error when upload data csv ${file_path}`, res, err);
      }
      return response.ok(upload.data, res, `Success Create CSV File`, null);
    } else {
      return response.success(null, res, `Empty data`, null);
    }
  },

  pdf: async function (req, res) {
    let upload, err;

    let child = await ApiController.getChildFromParent2(`Cyclonecurrent`, file_path, {is_delete: false}, `tc_name month year area`, `tropical_cyclone_id`);
    if (child.status == 400) {
      response.error(400, child.message, res, child.message);
    }

    if (child.status == 200) {
      let template = fs.readFileSync('./files/html/table/table.ejs', 'utf8');
      let today = moment.utc().format(`YYYYMMDDHHMMSS`);
      let html = ejs.render(template, {data: child.data});
      let name_pdf = `${file_path}-${today}`;

      let create_pdf = await ApiController.generatePDF(html, file_path, name_pdf);
      if (create_pdf.status == 400) {
        response.error(400, `Error when create pdf`, res, create_pdf.message);
      }
      
      //CREATE PDF INTO DB
      if (create_pdf.data && file_path) {
        let str = create_pdf.data.filename;
        let n = str.indexOf(`pdf`);
        let path = str.substring(n-1, str.length)
        let obj = { name: name_pdf, path, type: `pdf`}
        upload = await UploadController.createExternalFile(obj, null, null, `create`)
        if (upload.status == 400) {
          return response.error(400, `Error when upload data in createData tropical cyclone`, res, err);
        }
      }
      response.ok(upload.data, res, `success create pdf`);
    }
  },

  read: async function (req, res) {
    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers tropical cyclone`, res, checkHeaders.message);
    }

    let err, data = [], find, child, 
      today = moment.utc().format(`YYYYMMDDHHMMSS`), 
      arr_result = [], temp_file = {};

    try {
      //CHECK IF FILE EXIST OR NOT
      let check_file = await ApiController.existFileCyclone();
      if (check_file.status == 400 || check_file.data.length == 0) {
        response.error(400, `Error when check file exist`, res, check_file.message);
      }
      
      if (check_file.status == 200 && check_file.data.length > 0) {
        let cyclone = check_file.data;

        async.forEach(cyclone, (temp_z, cb) => {
          async.waterfall([
            async function GetData() {
              // 1. CEK DI DB APA ADA TC YANG SAMA ATAU GK, KLO ADA UPDATE, KLO GK ADA CREATE
              let read_file = fs.readFileSync(`files/tc_module/${temp_z.name}.txt`, 'utf8');
              let str = read_file.toString();
              let tc_name = str.substring(str.indexOf(`<Name>`)+6, str.indexOf(`</Name>`));
              let temp_posisi = str.substring(str.indexOf(`<Position>`)+10, str.indexOf(`</Position>`));
              let temp_max_wind = str.substring(str.indexOf(`<MaxWind>`)+9, str.indexOf(`</MaxWind>`));
              let temp_date = str.substring(str.indexOf(`<Time>`)+6, str.indexOf(`</Time>`));
              
              temp_date = temp_date.split(` `);
              temp_posisi = temp_posisi.split(` `);
              temp_max_wind = temp_max_wind.split(` `);
  
              let latitude = (temp_posisi[0]) ? temp_posisi[0].substring(0, temp_posisi[0].length - 1) : null;
              let longitude = (temp_posisi[1]) ? temp_posisi[1] : null;
              let max_wind_speed = (temp_max_wind[0]) ? temp_max_wind[0]: null;
              let dateParts = temp_date[0].split("/");
              let date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
              // let date = (temp_date[0]) ? new Date(temp_date[0]) : null;
              let obj = { latitude, longitude, max_wind_speed, dateParts, date, tc_name };
              return obj;
            }, 
  
            async function InputDatabase(response, cb) {
              let {latitude, longitude, max_wind_speed, dateParts, date, tc_name} = response, obj = {};
              if (latitude && longitude && max_wind_speed && dateParts && date) {
                let convert = await ApiController.convert(latitude, longitude, `dms`);
    
                let parent_data = { tc_name, is_delete: false, is_active: true, year: moment(date).format(`YYYY`), month: moment(date).format(`M`) };
                let child_data = { 
                  latitude_dd : latitude.substring(0, latitude.length - 2), 
                  longitude_dd: longitude.substring(0, longitude.length - 2), 
                  latitude: (convert.status == 200) ? convert.data.lat : null, 
                  longitude: (convert.status == 200) ? convert.data.lng : null, 
                  max_wind_speed, 
                  datetime: date, 
                  is_delete: false 
                };
    
                let filter_child_data = { datetime: date, is_delete: false };
                let is_empty_parent = Object.values(child_data).some(x => x == null);
                let is_empty_child = Object.values(parent_data).some(x => x == null);
    
                //FIND TC
                if (!is_empty_parent && !is_empty_child) {
                  [err, find] = await flatry( Model.findOne({tc_name : {"$regex": `${tc_name}$`, $options: "-i"}, is_delete: false}));
                  if (err) {
                    console.log(err.stack);
                    obj = {status: 400, data: null, message: err}
                  }
                  
                  //SEND DATA TO NEXT PROCEDURE
                  obj = {
                    status: 200, 
                    data: {
                      parent_data,
                      child_data,
                      find,
                      filter_child_data,
                      temp_z,
                    },
                    message: `Success get data`
                  }
                } else {
                  response.error(400, `Error when get data from file`, res, `There is empty attribute from parent_data or child_data`);
                }
              } else [
                obj = {status: 400, data: null, message: `There is empty attribute from parent_data or child_data`}
              ]
              return obj;
            }
          ], (err, result) => {
            if (err) {
              console.log(err);
              arr_result = []
              cb();
            }
           
            arr_result.push(result);
            cb();
          });
        }, async (err) => {
          if (err) {
            console.log(err)
            return response.error(400, `Error after finish async for each`, res, err);
          }

          if (arr_result.length > 0) {
            for (let o = 0; o < arr_result.length; o++) {
              let temp_o = arr_result[o];
              if (temp_o.status == 200 ){
                let {find, parent_data, child_data, filter_child_data, temp_z} = temp_o.data;
                
                //CREATE OR UPDATE TC PARENT AND CHILD
                if (find) {
                  //UPDATE DATA
                  child = await ApiController.cuChildAndParent(`Cyclonecurrent`, find._id, file_path, parent_data, child_data, `update`, filter_child_data);
                } else {
                  //CREATE DATA IF DOESN'T EXIST
                  child = await ApiController.cuChildAndParent(`Cyclonecurrent`, null, file_path, parent_data, child_data, `create`, null);
                }
  
                if (child.status == 400) {
                  return response.error(400, child.message, res, child.message);
                }
                data.push(child.data.parent);
  
                //COPY FILE TO SERVER FOLDER
                for (let i = 0; i < temp_z.arr_file.length; i++) {
                  let temp = temp_z.arr_file[i], random = Math.floor((Math.random() * 100) + 1);
                  src = `files/tc_module/${temp.file}.txt`;
                  dest = `files/${temp.type}/${temp.rename}${today}${random}.txt`;
                  await fse.copy(src, dest).catch((err) => {
                    if (err) {
                      return response.error(400, `Error when copy 18 file`, res, `Error when copy 18 file`);
                    }
                  });
                  file_size = fse.statSync(src).size;
                  temp_file.files = {
                    name: `${temp.rename}${today}${random}`,
                    path: dest,
                    mimetype: `txt`,
                    size: file_size,
                    temp_file: true
                  }
                  
                  if (find) {
                    upload = await UploadController.chooseUploadData(temp_file, temp.type, child.data.parent._id, `update`)
                  } else {
                    upload = await UploadController.chooseUploadData(temp_file, temp.type, child.data.parent._id, `create`)
                  }
                  if (upload.status == 400) {
                    return response.error(400, `Error when upload data in update upload file tropicalcyclone`, res, err);
                  } 
                  temp_file.files = {};
                }
              } else {
                console.log(`File didnt exist`);
              }
              
            }
          }
          response.ok(data, res, `success read file`);
        });
      }
    } catch (err) {
      console.log(err)
      response.error(400, `Error when read`, res, err);
    }
  },

  approve: async function (req, res) {
    if (Object.entries(req.body).length > 0) {
      let { is_super_admin, is_admin , _id } = req.body;
      
      if (is_super_admin || is_admin) {
        let old = { _id, is_delete: false }, new_data = { is_current : true, modified_at: moment.utc().format(`YYYY-MM-DDTHH:mm:ss.SSSZ`) }, 
          err, data, options = {new: true};

        [err, data] = await flatry( Model.findOneAndUpdate( old, new_data, options ));
        if (err) {
          console.log(err.stack);
          response.error(400, `Error when filter data in tropicalcyclone`, res, err);
        }

        response.ok(data, res, `success get update is current in tropicalcyclone`);
      } else {
        response.error(400, `Sorry, only admin could approve tropical cyclone view`, res);
      }
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  remove: async function (req, res) {
    let err;

    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers tropical cyclone`, res, checkHeaders.message);
    }
 
    let old_update_active = { is_delete: false }, new_data_update_active = { is_active : false };
    [err] = await flatry( Model.updateMany( old_update_active, new_data_update_active ));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when update many data in tropicalcyclone remove`, res, err);
    }

    let old_find = { is_current : true, is_delete : false}, new_data_find = {is_active: true};
    [err] = await flatry( Model.updateMany( old_find, new_data_find ));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when update many data in tropicalcyclone remove`, res, err);
    }

    let old_update = { is_delete: false }, new_data_update = { is_current : false };
    [err] = await flatry( Model.updateMany( old_update, new_data_update ));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when update many data in tropicalcyclone remove`, res, err);
    }

    response.ok(null, res, `Success remove current cyclone`);
  },

  show: async function (req, res) {
    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers tropical cyclone`, res, checkHeaders.message);
    }
    
    let old_update = { is_delete: false, is_active: true }, new_data_update = { is_current : true };
    [err] = await flatry( Model.updateMany( old_update, new_data_update ));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when update many data in tropicalcyclone show`, res, err);
    }

    let old_update_active = { is_delete: false }, new_data_update_active = { is_active : false };
    [err] = await flatry( Model.updateMany( old_update_active, new_data_update_active ));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when update many data in tropicalcyclone show`, res, err);
    }

    response.ok(null, res, `Success show current cyclone`);
  },

  getAllData: async function (req, res) {
    let err, find, fields = [], data = [], sort_data = { created_at: -1 };

    //CHECK HEADERS
     let checkHeaders = await ApiController.checkHeaders(req.headers)
     if (checkHeaders.status == 400) {
       return response.error(400, `Error when check headers tropical cyclone`, res, checkHeaders.message);
     }
 
    [err, find] = await flatry( Model.find({ is_delete: false }, `tc_name year area is_active is_current _id`).sort( sort_data ));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData tropicalcyclone`, res, err);
    }
    
    if (find.length > 0) {
      fields.push(
        { key: 'tc_name', label: 'TC Name', sortable: true, sortDirection: 'desc' },
        { key: 'year', label: 'Year', sortable: true },
        { key: 'area', label: 'Area', sortable: true },
        { key: 'is_current', label: 'Status', sortable: true, formatter: true, sortByFormatted: true, filterByFormatted: true},
        { key: 'actions', label: 'Actions', class: 'text-center w-15' }
      );

      for (let i = 0; i < find.length; i++) {
        let temp = find[i];
        data.push({
          _id: temp._id,
          tc_name: (temp.tc_name) ? temp.tc_name : `-`,
          year: (temp.year) ? temp.year : `-`,
          area: (temp.area) ? temp.area : `-`,
          is_current: temp.is_current,
        })
      }
      
      response.ok(data, res, `success get all data`, fields);
    } else if (find.length == 0) {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  getData: async function (req, res) {
    let err, data, { id } = req.params, child_fields = [], childs = [];
    
    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers tropical cyclone`, res, checkHeaders.message);
    }

    [err, data] = await flatry( Model.findOne({ is_delete: false, _id: id }, { strict: false }));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when findOne data in getdata tropicalcyclone`, res, err);
    }

    //UPLOAD FILE
    let upload = await UploadController.getMultipleFile(file_path, id)
    // let upload = await UploadController.getFile(file_path, id)
    if (upload.status == 400 && !upload.data) {
      response.error(400, `Error when upload data in createData tropicalcyclone`, res, err);
    }
    
    if (data) {
      //GET ALL CHILD
      let child = await ApiController.getChildFromParent(`Cyclonecurrent`, data._id, file_path, `datetime latitude longitude latitude_dd longitude_dd pressure max_wind_speed tropical_cyclone_id`, null);
      if (child.status == 400) {
        response.error(400, child.message, res, child.message);
      }
      
      if(child.status == 200) {
        child_fields.push(
          { key: 'date', label: 'Date', sortable: true},
          { key: 'time', label: 'Time', sortable: true},
          { key: 'latitude_dd', label: 'Latitude', sortable: true },
          { key: 'longitude_dd', label: 'Longitude', sortable: true },
          { key: 'pressure', label: 'Pressure', sortable: true },
          { key: 'max_wind_speed', label: 'Max Wind Speed', sortable: true },
          { key: 'actions', label: 'Actions', class: 'text-center w-15' }
        );

        for (let i = 0; i < child.data.length; i++) {
          let temp = child.data[i];
          childs.push({
            _id: temp._id,
            date: (temp.datetime) ? moment(temp.datetime).format(`DD-MM-YYYY`) : `-`,
            time: (temp.datetime) ? moment(temp.datetime).format(`HH:mm:ss`) : `-`,
            latitude: (temp.latitude) ? temp.latitude : `-`,
            longitude: (temp.longitude) ? temp.longitude : `-`,
            latitude_dd: (temp.latitude_dd) ? temp.latitude_dd : `-`,
            longitude_dd: (temp.longitude_dd) ? temp.longitude_dd : `-`,
            pressure: (temp.pressure) ? temp.pressure : `-`,
            max_wind_speed: (temp.max_wind_speed) ? temp.max_wind_speed : `-`,
            tropical_cyclone_id: (temp.tropical_cyclone_id) ? temp.tropical_cyclone_id : `-`
          })
        }
      }

      //UPLOAD FILE
      data = {
        content: data,
        childs,
        child_fields,
        files : (upload.data.length > 0) ? upload.data : null
        // file_name: (upload.data) ? upload.data.name : null,
        // file_path: (upload.data) ? upload.data.path : null,
        // file_type: (upload.data) ? upload.data.type : null
      }

      response.ok(data, res, `success get all data`);
    } else {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  createData: async function (req, res) {
    if (Object.entries(req.body).length > 0) {
      let { tc_name, month, year, area, is_current, techincal_bulletin, public_info_bulletin, ocean_gale_storm_warn, track_impact, coastal_zone, extreme_weather, gale_warning } = req.body, err, data;
      let new_data = { tc_name, month, year, area, is_current, techincal_bulletin, public_info_bulletin, ocean_gale_storm_warn, track_impact, coastal_zone, extreme_weather, gale_warning };
      
      let filter = [ { att : `tc_name`, type: `string`, value: tc_name}, { att : `year`, type: `string`, value: year}, { att : `is_delete`, type: `boolean`, value: false}];
      let redundant = await ApiController.redundant(Model, filter, null, false, null, `create`, true);
      if (redundant.status == 201) {
        response.error(400, redundant.message, res, redundant.message);
      }

      if (redundant.status == 200) {
        [err, data] = await flatry( Model.create( new_data ));
        if (err) {
          console.log(err.stack);
          response.error(400, `Error when create data in createData tropicalcyclone`, res, err);
        }
  
        //UPLOAD FILE
        if (req.files && data && file_path) {
          let upload;
          upload = await UploadController.chooseUploadData(req.files, file_path, data._id, `create`)
          if (upload.status == 400) {
            response.error(400, `Error when upload data in ${file_path}`, res, err);
          }
        }
  
        response.ok(data, res, `success create data`);
      }
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateData: async function (req, res) {
    if (Object.entries(req.body).length > 0 && Object.entries(req.params).length > 0) {
      let { tc_name, month, year, area, is_current, techincal_bulletin, public_info_bulletin, ocean_gale_storm_warn, track_impact, coastal_zone, extreme_weather, gale_warning } = req.body, { id } = req.params;
      let new_data = {tc_name, month, year, area, is_current, techincal_bulletin, public_info_bulletin, ocean_gale_storm_warn, track_impact, coastal_zone, extreme_weather, gale_warning }, err, data,
        filter = { _id: id, is_delete: false };
      let redundant_filter = [ { att : `_id`, type: `not-id`, value: id}, { att : `tc_name`, type: `string`, value: tc_name}, { att : `year`, type: `string`, value: year}, { att : `is_delete`, type: `boolean`, value: false}];

      let check_data = Object.values(new_data).every(x => x);
      new_data = (check_data) ? new_data : req.body;
      let redundant = (check_data && tc_name) ? await ApiController.redundant(Model, redundant_filter, null, false, id, `update`, true) : { status : 200 };
      if (redundant.status == 201) {
        response.error(400, redundant.message, res, redundant.message);
      }
      
      if (redundant.status == 200) {
        [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
        if (err) {
          console.log(err.stack);
          response.error(400, `Error when findoneandupdate data in updatedata tropicalcyclone`, res, err);
        }
  
        //UPLOAD FILE FOR MULTIPLE AND SINGLE UPLOAD FILE
        if (req.files && data && file_path) {
          let upload;
          upload = await UploadController.chooseUploadData(req.files, file_path, data._id, `update`)
          if (upload.status == 400) {
            response.error(400, `Error when upload data in ${file_path}`, res, err);
          }
        }
        
        for (const [key, value] of Object.entries(req.body)) {
          if (key.includes(`file`)) {
            let upload = await UploadController.deleteFile(value, key)
            if (upload.status == 400) {
              return response.error(400, `Error when delete empty file ${file_path}`, res, err);
            }
          }
        }
        
        response.ok(data, res, `success update data`);
      }
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  deleteData: async function (req, res) {
    if (Object.entries(req.params).length > 0) {

      let { id } = req.params, err, data,
      filter = { _id: id, is_delete: false },
      new_data = { is_delete: true };
      
      [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
      if (err || !data) {
        response.error(400, `Error when findOneAndUpdate data in deleteData tropicalcyclone`, res, err);
      }
      
      let child = await ApiController.getChildToDelete(`Cyclonecurrent`, id, file_path);
      if (child.status == 400) {
        response.error(400, child.message, res, child.message);
      }
      
      //UPLOAD FILE
      if (data && child.status == 200) {
        let upload = await UploadController.deleteFile(data._id, file_path)
        if (upload.status == 400) {
          response.error(400, `Error when upload data in createData tropicalcyclone`, res, err);
        }
        response.ok(data, res, `success delete data`);
      }
    } else {
      response.error(400, `Data not completed`, res);
    }
  },
};

module.exports = TropicalcycloneController;

