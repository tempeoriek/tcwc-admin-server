const Loginattempt = require('../models/login_attempt'),
  ApiController = require('./ApiController');

LoginattemptController = {
  fetchRecord: async function (req, res) {
                 
    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers cyclonecitra`, res, checkHeaders.message);
    }

    response.ok(data, res, `request success`)
  },
};

module.exports = LoginattemptController;

