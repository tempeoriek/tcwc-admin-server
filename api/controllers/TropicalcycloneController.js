const Model = require('../models/tropical_cyclone'),
  UploadController = require('./UploadController'),
  ApiController = require('./ApiController'),
  file_path = `tropicalcyclone`;

TropicalcycloneController = {
  read: async function (req, res) {
    let err, data, find, child, today = moment.utc().format(`YYYYMMDDHHMMSS`), flag = 0,
      exists1, exists2, file_not_exist = [];
 
    try {
      //CHECK IF FILE EXIST OR NOT
      exists1 = await fse.pathExists(`files/tc_module/IDJ21110.txt`);
      let arr_file = [ 
        {file: `IDJ21020`, rename: `IDJ21020-techincal_bulletin_file-indo-1-${today}`, type: `techincal_bulletin_file`, },
        {file: `IDJ21021`, rename: `IDJ21021-techincal_bulletin_file-indo-2-${today}`, type: `techincal_bulletin_file`, },
        {file: `IDJ21030`, rename: `IDJ21030-public_info_bulletin_file-indo-1-${today}`, type: `public_info_bulletin_file`, },
        {file: `IDJ21031`, rename: `IDJ21031-public_info_bulletin_file-indo-2-${today}`, type: `public_info_bulletin_file`, },
        {file: `IDJ20050`, rename: `IDJ20050-coastal_zone_file-eng-1-${today}`, type: `coastal_zone_file`, },
        {file: `IDJ20051`, rename: `IDJ20051-coastal_zone_file-eng-2-${today}`, type: `coastal_zone_file`, },
        {file: `IDJ21050`, rename: `IDJ21050-coastal_zone_file-indo-1-${today}`, type: `coastal_zone_file`, },
        {file: `IDJ21051`, rename: `IDJ21051-coastal_zone_file-indo-2-${today}`, type: `coastal_zone_file`, },
        {file: `IDJ20060`, rename: `IDJ20060-ocean_gale_storm_warn_file-eng-1-${today}`, type: `ocean_gale_storm_warn_file`, },
        {file: `IDJ20061`, rename: `IDJ20061-ocean_gale_storm_warn_file-eng-2-${today}`, type: `ocean_gale_storm_warn_file`, },
        {file: `IDJ21060`, rename: `IDJ21060-ocean_gale_storm_warn_file-indo-1-${today}`, type: `ocean_gale_storm_warn_file`, },
        {file: `IDJ21061`, rename: `IDJ21061-ocean_gale_storm_warn_file-indo-2-${today}`, type: `ocean_gale_storm_warn_file`, },
        {file: `IDJ22000`, rename: `IDJ22000-track_impact_file-eng-1-${today}`, type: `track_impact_file`, },
        {file: `IDJ22005`, rename: `IDJ22005-track_impact_file-eng-2-${today}`, type: `track_impact_file`, },
        {file: `IDJ22100`, rename: `IDJ22100-track_impact_file-indo-1-${today}`, type: `track_impact_file`, },
        {file: `IDJ22105`, rename: `IDJ22105-track_impact_file-indo-2-${today}`, type: `track_impact_file`, },
        {file: `IDJ20080`, rename: `IDJ20080-extreme_weather_file-eng-1-${today}`, type: `extreme_weather_file`, },
        {file: `IDJ20081`, rename: `IDJ20081-extreme_weather_file-eng-2-${today}`, type: `extreme_weather_file`, },
        {file: `IDJ21080`, rename: `IDJ21080-extreme_weather_file-indo-1-${today}`, type: `extreme_weather_file`, },
        {file: `IDJ21081`, rename: `IDJ21081-extreme_weather_file-indo-1-${today}`, type: `extreme_weather_file`, },
        {file: `IDJ20100`, rename: `IDJ20100-gale_warning_file-eng-${today}`, type: `gale_warning_file`, },
        {file: `IDJ21100`, rename: `IDJ21100-gale_warning_file-indo-${today}`, type: `gale_warning_file`, }
      ];

      //CHECK IF FILE EXIST OR NOT
      for (let i = 0; i < arr_file.length; i++) {
        let temp = arr_file[i];
        exists2 = await fse.pathExists(`files/tc_module/${temp.file}.txt`);
        if (!exists2) {
          flag++;
          file_not_exist.push(temp.file);
        }
      }

      if (exists1 && flag == 0) {
        // 1. CEK DI DB APA ADA TC YANG SAMA ATAU GK, KLO ADA UPDATE, KLO GK ADA CREATE
        await glob(`**/IDJ21110.txt`, async (er, file) => {
          if (err) {
            console.log(err)
            response.error(400, `Error when glob in read`, res, err);
          } else {
            let temp_file = fs.readFileSync(file[0], 'utf8');
            let str = temp_file.toString();
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
            let date = (temp_date[0]) ? new Date(temp_date[0]) : null;

            let convert = await ApiController.convert(latitude, longitude, `dms`);

            let parent_data = { tc_name, is_delete: false, is_active: true, year: moment(date).format(`YYYY`) };
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
                response.error(400, `Error when find data in read tropicalcyclone`, res, err);
              }

              if (find) {
                //UPDATE DATA
                child = await ApiController.cuChildAndParent(`Cyclonecurrent`, find._id, file_path, parent_data, child_data, `update`, filter_child_data);
              } else {
                //CREATE DATA IF DOESN'T EXIST
                child = await ApiController.cuChildAndParent(`Cyclonecurrent`, null, file_path, parent_data, child_data, `create`, null);
              }
              if (child.status == 400) {
                response.error(400, child.message, res, child.message);
              }
              data = child;
              
              //2. MOVE 14 FILE KE FILE 7 KATEGORI TC
              let temp_file = {}, src, dest, file_size;
              for (let i = 0; i < arr_file.length; i++) {
                let temp = arr_file[i];
                src = `files/tc_module/${temp.file}.txt`;
                dest = `files/${temp.type}/${temp.rename}.txt`;
                await fse.copy(src, dest).catch((err) => {
                  if (err) {
                    response.error(400, `Error when copy 18 file`, res, `Error when copy 18 file`);
                  }
                });
                file_size = fse.statSync(src).size;
                temp_file = {
                  name: temp.rename,
                  path: dest,
                  mimetype: `txt`,
                  size: file_size,
                  temp_file: true
                }
                upload = await UploadController.uploadData(temp_file, temp.type, data.data.parent._id, `create`)
                if (upload.status == 400) {
                  response.error(400, `Error when upload data in createData tropicalcyclone`, res, err);
                }
                temp_file = {};
              }
            
              response.ok(data, res, `success read file`);
            } else {
              response.error(400, `Error when get data from file`, res, `There is empty attribute from parent_data or child_data`);
            }
          }
        })
      } else {
        response.error(400, `File doesn't exist`, res, file_not_exist);
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
    let old = { is_delete: false }, new_data = { is_current : false }, err;
    [err] = await flatry( Model.updateMany( old, new_data ));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when filter data in tropicalcyclone`, res, err);
    }

    response.ok(null, res, `success get update is current in tropicalcyclone`);
  },

  getAllData: async function (req, res) {
    let err, find, fields = [], data = [], sort_data = { created_at: -1 };
    [err, find] = await flatry( Model.find({ is_delete: false }, `tc_name year area is_active _id`).sort( sort_data ));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData tropicalcyclone`, res, err);
    }
    
    if (find.length > 0) {
      fields.push(
        { key: 'tc_name', label: 'TC Name', sortable: true, sortDirection: 'desc' },
        { key: 'year', label: 'Year', sortable: true },
        { key: 'area', label: 'Area', sortable: true },
        { key: 'is_active', label: 'Status' },
        { key: 'actions', label: 'Actions', class: 'text-center w-15' }
      );

      for (let i = 0; i < find.length; i++) {
        let temp = find[i];
        data.push({
          _id: temp._id,
          tc_name: (temp.tc_name) ? temp.tc_name : `-`,
          year: (temp.year) ? temp.year : `-`,
          area: (temp.area) ? temp.area : `-`,
          is_active: (temp.is_active) ? temp.is_active : `-`,
        })
      }
      
      response.ok(data, res, `success get all data`, fields);
    } else if (find.length == 0) {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  getData: async function (req, res) {
    let err, data, { id } = req.params, child_fields = [], childs = [];
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
          { key: 'latitude', label: 'Latitude', sortable: true },
          { key: 'longitude', label: 'Longitude', sortable: true },
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
      let { tc_name, year, area, is_active, techincal_bulletin, public_info_bulletin, ocean_gale_storm_warn, track_impact, coastal_zone, extreme_weather, gale_warning } = req.body, err, data;
      let new_data = { tc_name, year, area, is_active, techincal_bulletin, public_info_bulletin, ocean_gale_storm_warn, track_impact, coastal_zone, extreme_weather, gale_warning };
      
      let redundant = await ApiController.redundant(Model, "tc_name", tc_name, false, null, `create`);
      if (redundant.status == 201) {
        response.error(400, redundant.message, res, redundant.message);
      }
      
      if (redundant.status == 200) {
        [err, data] = await flatry( Model.create( new_data ));
        if (err) {
          console.log(err.stack);
          response.error(400, `Error when create data in createData tropicalcyclone`, res, err);
        }
  
        //UPLOAD FILE FOR MULTIPLE AND SINGLE UPLOAD FILE
        if (req.files && data && file_path) {
          let upload;
          if (Object.entries(req.files).length == 1 && req.files.files != undefined) {
            upload = await UploadController.uploadData(req.files.files, file_path, data._id, `update`)
            if (upload.status == 400) {
              response.error(400, `Error when upload data in updateData tropicalcyclone`, res, err);
            }  
          } else if (Object.entries(req.files).length >= 2 && req.files.files != undefined) {
            for (let i = 0 ; i < req.files.files.length ; i ++) {
              let temp = req.files.files[i]
              upload = await UploadController.uploadData(temp, file_path, data._id, `update`)
              if (upload.status == 400) {
                response.error(400, `Error when upload data in updateData tropicalcyclone`, res, err);
              }  
            }
          } else if (Object.entries(req.files).length > 0 && req.files.files == undefined) {
            for (const att in req.files) {
              let attribute = (att == `files`) ? file_path : att;
              upload = await UploadController.uploadData(req.files[att], attribute, data._id, `update`)
              if (upload.status == 400) {
                response.error(400, `Error when upload data in updateData tropicalcyclone`, res, err);
              }
            }
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
      let { tc_name, year, area, is_active, max_wind_speed, techincal_bulletin, public_info_bulletin, ocean_gale_storm_warn, track_impact, coastal_zone, extreme_weather, gale_warning } = req.body, { id } = req.params;
      let new_data = {tc_name, year, area, is_active, max_wind_speed, techincal_bulletin, public_info_bulletin, ocean_gale_storm_warn, track_impact, coastal_zone, extreme_weather, gale_warning }, err, data, 
        filter = { _id: id, is_delete: false };

      let check_data = Object.values(new_data).every(x => x);
      new_data = (check_data) ? new_data : req.body;
      let redundant = (check_data && tc_name) ? await ApiController.redundant(Model, "tc_name", tc_name, false, id, `update`) : { status : 200 };
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
          if (Object.entries(req.files).length == 1 && req.files.files != undefined) {
            upload = await UploadController.uploadData(req.files.files, file_path, data._id, `update`)
            if (upload.status == 400) {
              response.error(400, `Error when upload data in updateData tropicalcyclone`, res, err);
            }  
          } else if (Object.entries(req.files).length >= 2 && req.files.files != undefined) {
            for (let i = 0 ; i < req.files.files.length ; i ++) {
              let temp = req.files.files[i]
              upload = await UploadController.uploadData(temp, file_path, data._id, `update`)
              if (upload.status == 400) {
                response.error(400, `Error when upload data in updateData tropicalcyclone`, res, err);
              }  
              console.log(upload)
            }
          } else if (Object.entries(req.files).length > 0 && req.files.files == undefined) {
            for (const att in req.files) {
              let attribute = (att == `files`) ? file_path : att;
              upload = await UploadController.uploadData(req.files[att], attribute, data._id, `update`)
              if (upload.status == 400) {
                response.error(400, `Error when upload data in updateData tropicalcyclone`, res, err);
              }
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
        console.log(err.stack);
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

