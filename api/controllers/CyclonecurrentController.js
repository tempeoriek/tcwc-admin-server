const Model = require('../models/cyclone_current');
const Tropical = require('../models/tropical_cyclone');

CyclonecurrentController = {
  getAllData: async function (req, res) {
    let err, data, sort_data = { datetime: 1 };
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
      let new_data = { datetime, latitude, longitude, pressure, max_wind_speed, tropical_cyclone_id };

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
      let { datetime, latitude, longitude, pressure, max_wind_speed } = req.body, { id } = req.params;
      let new_data = { datetime, latitude, longitude, pressure, max_wind_speed }, err, data, 
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
  }
    
};

module.exports = CyclonecurrentController;

