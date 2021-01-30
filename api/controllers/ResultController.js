const Model = require('../models/result'),
  ApiController = require('./ApiController');

ResultController = {
  getAllData: async function (req, res) {
    let err, find, fields = [], data = [];
                                 
    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers cyclonecitra`, res, checkHeaders.message);
    }

    [err, find] = await flatry( Model.find({ is_delete: false }, `result suggestion`));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData ResultController`, res, err);
    }
    
    if (find.length > 0) {
      fields.push(
        { key: 'result', label: 'Result', sortable: true},
        { key: 'suggestion', label: 'Suggestion', sortable: true },
        { key: 'actions', label: 'Actions' }
      );

      for (let i = 0; i < find.length; i++) {
        let temp = find[i];
        data.push({
          _id: temp._id,
          result: temp.result,
          suggestion: temp.suggestion,
        })
      }
      response.ok(data, res, `success get all data`, fields);
    } else if (find.length == 0) {
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

    [err, data] = await flatry( Model.findOne({ is_delete: false, _id: id }));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when findOne data in getdata ResultController`, res, err);
    }

    if (data) {
      response.ok(data, res, `success get all data`);
    } else {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  createData: async function (req, res) {
    if (Object.entries(req.body).length > 0) {
      let { result, suggestion } = req.body, err, data;
      let new_data = { result, suggestion };

      [err, data] = await flatry( Model.create( new_data ));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when create data in createData ResultController`, res, err);
      }

      response.ok(data, res, `success create data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateData: async function (req, res) {
    if (Object.entries(req.body).length > 0 && Object.entries(req.params).length > 0) {
      let { result, suggestion } = req.body, { id } = req.params;
      let new_data = { result, suggestion }, err, data, 
      filter = { _id: id, is_delete: false };
      
      [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when findoneandupdate data in updatedata ResultController`, res, err);
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
        response.error(400, `Error when findOneAndUpdate data in deleteData ResultController`, res, err);
      }

      response.ok(data, res, `success delete data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  }
};

module.exports = ResultController;

