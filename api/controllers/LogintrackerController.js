const Model = require('../models/login_tracker'),
  ApiController = require('./ApiController');

LogintrackerController = {
  getData: async function (req, res) {
    let err, data, { token } = req.body;
                     
    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers cyclonecitra`, res, checkHeaders.message);
    }

    [err, data] = await flatry( Model.findOne({ is_delete: false, token }).populate(`user_id`));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when findOne data in getdata Menu`, res, err);
    }

    if (data) {
      response.ok(data, res, `success get all data`);
    } else {
      response.success(data, res, `success get all data but data is empty`);
    }
  },
};

module.exports = LogintrackerController;

