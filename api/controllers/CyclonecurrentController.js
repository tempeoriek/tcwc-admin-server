const Model = require('../models/cyclone_current'),
  ApiController = require('./ApiController'),
  file_path = `cyclonecurrent`,
  { transforms: { unwind } } = require('json2csv'),
  Tropical = require('../models/tropical_cyclone');

CyclonecurrentController = {
  csv: async function (req, res) {
    let err, data, fields = [];
    [err, data] = await flatry( Tropical.find({ is_delete: false }, "month year area"));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getTropicalCylone cyclonecurrent`, res, err);
    }

    if (data.length > 0) {
      let temp_month = {}, data_month = {}, temp_year = [], avg = {}, temp_month2 = {};
      for (let i = 0 ; i < data.length ; i++) {
        let temp = data[i];
        temp_year.push(parseInt(temp.year));
        if (i == 0 || temp_month[temp.month] == undefined) {
          if (temp.area) {
            temp_month[temp.month] = [];
          }
        }

        if (temp.area) {
          temp_month[temp.month].push(temp.area);
        }

        fields.push (
          { value: `total.${temp.month}.${temp.area}`, label: `Area ${temp.area} Month ${temp.month}`},
          { value: `avg.${temp.month}.${temp.area}`, label: `Average Area ${temp.area} Month ${temp.month}`},
        )
      }
      
      let year_max = Math.max(...temp_year);
      let year_min = Math.min(...temp_year);

      for (let obj in temp_month) {
        data_month[obj] = {};
        temp_month2[obj] = {};
        let uniq = [...new Set(temp_month[obj])];
        for (let i = 0 ; i < uniq.length ; i++) {
          let temp = temp_month[obj].filter(word => word == uniq[i]);
          data_month[obj][uniq[i]] = temp.length
          temp_month2[obj][uniq[i]] = parseFloat(parseInt(temp.length) / (year_max-year_min)).toFixed(2)
        }
      }

      data = {
        total: data_month,
        avg: temp_month2,
        year_min,
        year_max
      };

      let transforms = [unwind({ paths: [`total`, `avg`] })];
      let create_csv = await ApiController.generateCSV(data, fields, file_path, transforms)
      if (create_csv.status == 400) {
        return response.error(400, `Error when create csv`, res, create_csv.message);
      }
      
      let obj = { name: create_csv.data.name, path: create_csv.data.path, type: `csv`}
      let upload = await UploadController.createExternalFile(obj, null, null, `create`)
      if (upload.status == 400) {
        return response.error(400, `Error when upload data csv ${file_path}`, res, err);
      }
      return response.ok(upload.data, res, `Success Create CSV File`, null);
    } else if (data.length == 0) {
      response.success(data, res, `Success get all data but data is empty`);
    }
  },

  getAllData: async function (req, res) {
    let err, data, sort_data = { datetime: 1 };
     
    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers cyclonecitra`, res, checkHeaders.message);
    }

    [err, data] = await flatry( Model.find({ is_delete: false }).populate('tropical_cyclone_id').sort(sort_data));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData cyclonecurrent`, res, err);
    }
    
    if (data.length > 0) {
      response.ok(data, res, `success get all data`);
    } else if (data.length == 0) {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  getData: async function (req, res) {
    let err, data, { id } = req.params;
     
    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers cyclonecitra`, res, checkHeaders.message);
    }

    [err, data] = await flatry( Model.findOne({ is_delete: false, _id: id }).populate('tropical_cyclone_id'));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when findOne data in getdata cyclonecurrent`, res, err);
    }

    if (data) {
      response.ok(data, res, `success get all data`);
    } else {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  createData: async function (req, res) {
    if (Object.entries(req.body).length > 0) {
      let { datetime, latitude, longitude, pressure, max_wind_speed, tropical_cyclone_id } = req.body, err, data;
      // latitude = `70°30'30" S`;
      // longitude = `164°45'15" E`;
      let convert = await ApiController.convert(latitude, longitude, `dms`);
      let new_data = { datetime, pressure, max_wind_speed, tropical_cyclone_id, latitude: convert.data.lat, longitude: convert.data.lng, latitude_dd: latitude, longitude_dd: longitude };
      [err, data] = await flatry( Model.create( new_data ));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when create data in createData cyclonecurrent`, res, err);
      }

      response.ok(data, res, `success create data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateData: async function (req, res) {
    if (Object.entries(req.body).length > 0 && Object.entries(req.params).length > 0) {
      let { datetime, latitude, longitude, pressure, max_wind_speed, tropical_cyclone_id } = req.body, { id } = req.params;
      let convert = await ApiController.convert(latitude, longitude, `dms`);
      let new_data = { datetime, latitude: convert.data.lat, longitude: convert.data.lng, latitude_dd: latitude, longitude_dd: longitude, pressure, max_wind_speed, tropical_cyclone_id }, err, data, 
      filter = { _id: id, is_delete: false };
      
      [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when findoneandupdate data in updatedata cyclonecurrent`, res, err);
      }

      response.ok(data, res, `success update data`);
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
        response.error(400, `Error when findOneAndUpdate data in deleteData cyclonecurrent`, res, err);
      }

      response.ok(data, res, `success delete data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  getTropicalCylone: async function (req, res) {
    let err, data;
     
    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers cyclonecitra`, res, checkHeaders.message);
    }

    [err, data] = await flatry( Tropical.find({ is_delete: false }));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getTropicalCylone cyclonecurrent`, res, err);
    }
    
    if (data.length > 0) {
      response.ok(data, res, `success get all data`);
    } else if (data.length == 0) {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  countByMonth: async function (req, res) {
    let err, data = {};
     
    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers cyclonecitra`, res, checkHeaders.message);
    }

    // [err, data] = await flatry( Model.find({ is_delete: false }, "_id").populate('tropical_cyclone_id', ['year']));
    [err, data] = await flatry( Tropical.find({ is_delete: false }, "month year area"));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getTropicalCylone cyclonecurrent`, res, err);
    }

    if (data.length > 0) {
      let temp_month = {}, data_month = {}, temp_year = [], avg = {}, temp_month2 = {};
      for (let i = 0 ; i < data.length ; i++) {
        let temp = data[i];
        temp_year.push(parseInt(temp.year));
        if (i == 0 || temp_month[temp.month] == undefined) {
        // if (i == 0 || temp_year[temp.tropical_cyclone_id.year] == undefined) {
          if (temp.area) {
            temp_month[temp.month] = [];
          }
          // temp_year[temp.tropical_cyclone_id.year] = [];
        }

        if (temp.area) {
          temp_month[temp.month].push(temp.area);
        }
        // temp_year[temp.year]++;
        // temp_year[temp.tropical_cyclone_id.year]++;
      }
      
      let year_max = Math.max(...temp_year);
      let year_min = Math.min(...temp_year);

      for (let obj in temp_month) {
        data_month[obj] = {};
        temp_month2[obj] = {};
        let uniq = [...new Set(temp_month[obj])];
        for (let i = 0 ; i < uniq.length ; i++) {
          let temp = temp_month[obj].filter(word => word == uniq[i]);
          data_month[obj][uniq[i]] = temp.length
          temp_month2[obj][uniq[i]] = parseFloat(parseInt(temp.length) / (year_max-year_min)).toFixed(2)
        }
      }

      data = {
        total: data_month,
        avg: temp_month2,
        year_min,
        year_max
      };
      response.ok(data, res, `success get all data`);
    } else if (data.length == 0) {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  countByYear: async function (req, res) {
    let err, data;
     
    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers cyclonecitra`, res, checkHeaders.message);
    }

    [err, data] = await flatry( Tropical.find({ is_delete: false }, "month year area"));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getTropicalCylone cyclonecurrent`, res, err);
    }

    if (data.length > 0) {
      let temp_month = {}, temp_year = [], avg = {};
      for (let i = 0 ; i < data.length ; i++) {
        let temp = data[i];
        if (i == 0 || temp_month[temp.month] == undefined) {
          temp_month[temp.month] = [];
        }
        
        temp_month[temp.month]++;
        temp_year.push(parseInt(temp.year));
      }
      
      let year_max = Math.max(...temp_year);
      let year_min = Math.min(...temp_year);
      for (const [key, value] of Object.entries(temp_month)) {
        avg[key] = parseFloat(parseInt(value) / (year_max-year_min)).toFixed(2);
      }
      
      data = {
        total: temp_month,
        avg,
        year_min,
        year_max
      }
      response.ok(data, res, `success get all data`);
    } else if (data.length == 0) {
      response.success(data, res, `success get all data but data is empty`);
    }
  }
    
};

module.exports = CyclonecurrentController;

