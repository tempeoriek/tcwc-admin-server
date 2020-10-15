const Model = require('../models/date_form');

DateformController = {
  getAllData: async function (req, res) {
    let err, find, fields = [], data = [];
    [err, find] = await flatry( Model.find({ is_delete: false }, `date time`));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData DateformController`, res, err);
    }
    
    if (find.length > 0) {
      fields.push(
        { key: 'date', label: 'Date', sortable: true},
        { key: 'time', label: 'Time', sortable: true },
        { key: 'actions', label: 'Actions' }
      );

      for (let i = 0; i < find.length; i++) {
        let temp = find[i];
        data.push({
          _id: temp._id,
          date: temp.date,
          time: temp.time,
        })
      }
      response.ok(data, res, `success get all data`, fields);
    } else if (find.length == 0) {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  getData: async function (req, res) {
    let err, data, { id } = req.params;
    [err, data] = await flatry( Model.findOne({ is_delete: false, _id: id }));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when findOne data in getdata DateformController`, res, err);
    }

    if (data) {
      response.ok(data, res, `success get all data`);
    } else {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  createData: async function (req, res) {
    if (Object.entries(req.body).length > 0) {
      let { date, time } = req.body, err, data;
      let new_data = { date, time };

      [err, data] = await flatry( Model.create( new_data ));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when create data in createData DateformController`, res, err);
      }

      response.ok(data, res, `success create data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateData: async function (req, res) {
    if (Object.entries(req.body).length > 0 && Object.entries(req.params).length > 0) {
      let { date, time } = req.body, { id } = req.params;
      let new_data = { date, time }, err, data, 
      filter = { _id: id, is_delete: false };
      
      [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when findoneandupdate data in updatedata DateformController`, res, err);
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
        response.error(400, `Error when findOneAndUpdate data in deleteData DateformController`, res, err);
      }

      response.ok(data, res, `success delete data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateDate: async function (dates, id) {
    let err,
      new_data = { cyclogenesis_checksheet_date_id: id };
      
    for (let i = 0; i < dates.length ; i++) {
      let temp = dates[i];
      [err] = await flatry( Model.findOneAndUpdate({ _id: temp, is_delete: false } , new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        return response.back(400, null, `Error when find one and update date form`);
      }
    }

    return response.back(200, null, `success update dates`);
  },

};

module.exports = DateformController;

