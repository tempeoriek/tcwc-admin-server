const Model = require('../models/cyclone_name_description');

CylonenamedescriptionController = {
  getAllData: async function (req, res) {
    let err, data;
    [err, data] = await flatry( Model.find({ is_delete: false }));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData cyclonename`, res, err);
    }
    
    if (data.length > 0) {
      response.ok(data, res, `success get all data`);
    } else if (data.length == 0) {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  getData: async function (req, res) {
    let err, data, { id } = req.params;
    [err, data] = await flatry( Model.findOne({ is_delete: false, _id: id }));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when findOne data in getdata cyclonename`, res, err);
    }

    if (data) {
      response.ok(data, res, `success get all data`);
    } else {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  createData: async function (req, res) {
    if (Object.entries(req.body).length > 0) {
      let { description } = req.body, err, data;
      let new_data = { description};

      [err, data] = await flatry( Model.create( new_data ));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when create data in createData cyclonename`, res, err);
      }

      response.ok(data, res, `success create data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateData: async function (req, res) {
    if (Object.entries(req.body).length > 0 && Object.entries(req.params).length > 0) {
      let { description } = req.body, { id } = req.params;
      let new_data = { description }, err, data, 
      filter = { _id: id, is_delete: false };
      
      [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when findoneandupdate data in updatedata cyclonename`, res, err);
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
        response.error(400, `Error when find data in getAllData cyclonename`, res, err);
      }

      response.ok(data, res, `success create data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },
};

module.exports = CylonenamedescriptionController;

