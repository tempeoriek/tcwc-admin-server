const Model = require('../models/tropical_cyclone'),
  UploadController = require('./UploadController'),
  ApiController = require('./ApiController'),
  file_path = `tropicalcyclone`;

TropicalcycloneController = {
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
      let child = await ApiController.getChildFromParent(`Cyclonecurrent`, data._id, file_path, `datetime latitude longitude latitude_dd longitude_dd pressure max_wind_speed tropical_cyclone_id`);
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
  
        //UPLOAD FILE
        if (req.files && data && file_path) {
          let upload = await UploadController.uploadData(req.files.files, file_path, data._id, `create`)
          if (upload.status == 400) {
            response.error(400, `Error when upload data in createData tropicalcyclone`, res, err);
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
      
      let redundant = await ApiController.redundant(Model, "tc_name", tc_name, false, id, `update`);
      if (redundant.status == 201) {
        response.error(400, redundant.message, res, redundant.message);
      }
      
      if (redundant.status == 200) {
        [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
        if (err) {
          console.log(err.stack);
          response.error(400, `Error when findoneandupdate data in updatedata tropicalcyclone`, res, err);
        }
  
        //UPLOAD FILE
        if (req.files && data && file_path) {
          let upload = await UploadController.uploadData(req.files.files, file_path, data._id, `update`)
          if (upload.status == 400) {
            response.error(400, `Error when upload data in createData tropicalcyclone`, res, err);
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
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when findOneAndUpdate data in deleteData tropicalcyclone`, res, err);
      }

      //UPLOAD FILE
      if (data) {
        let upload = await UploadController.deleteFile(data._id, file_path)
        if (upload.status == 400) {
          response.error(400, `Error when upload data in createData tropicalcyclone`, res, err);
        }
      }

      response.ok(data, res, `success delete data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },
};

module.exports = TropicalcycloneController;

