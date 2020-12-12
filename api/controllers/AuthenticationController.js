const User = require('../models/user'),
LoginTracker = require('../models/login_tracker'),
LoginAttempt = require('../models/login_attempt'),
settings = require('../../config/setting'),
jwt = require('jsonwebtoken');

AuthenticationController = {

  encodeJWT: function (user, secret) {
    return token = jwt.sign(user, secret);
  },

  login: async function (req, res) {
    let err, user, data = {};
    let { password, username } = req.body;

    [err, user] = await flatry( User.findOne({ username, is_delete: false }) );
    if (err) {
      response.error(400, `Error when findOne User`, res);
    }
    if (!user) {
      response.error(400, `User not found`, res);
    } else {
      console.log(`\nFound User`);

      /* //Check if user already try to login more than 3 times
      if (user.attempt_login >= 3) {
        //How to unblock? send email for unblock?
        return res.status(400).send( 'You have been blocked because you have reaced the maximum number of invalid login attempts. \nPlease contact our administrator to unblock' );
      } */

      // check if password matches
      bcrypt.compare(password, user.password, async (err, isMatch) => {
        if (isMatch && !err) {
          if (user.username) {
            // if user is found and password is right create a token
            let token = AuthenticationController.encodeJWT(user.toJSON(), settings.secret);
            let create_login_tracker =  AuthenticationController.createLoginTracker(token, user, req);
            [err] = await flatry(Promise.all([token, create_login_tracker]));
            if (err) {
              response.error(400, `Error when Promise all in login User`, res);
            }
            // await AuthenticationController.createLoginAttempt(user, 'success')
            data = {
              token,
              user
            }
            response.ok(data, res, `success login user`);
          } else {
            response.error(400, `Your account seems to be broken, please contact our admin to continue.`, res);
          }
        } else {
          //Create login attempt to block user
          // await AuthenticationController.createLoginAttempt(user, 'failed')
          response.error(400, `Authentication failed. Wrong password.`, res);
        }
      });
     
    }
  },
  
  updateSessionData: async function (req, res) {
    let err, user, token;

    [err, user] = await flatry( User.findOne({ _id: req.body._id }) );
    if (err) {
      response.error(400, `Error when findOne User`, res);
    }

    token = AuthenticationController.encodeJWT(user.toJSON(), settings.secret);
    response.ok(token, res, `success update token`);
  },

  createLoginTracker: async function (token, user, req) {
    let now = momenttz.tz("Asia/Jakarta").format('DD MMM YYYY HH:mm:ss'),
    ip_address = req.header('x-forwarded-for') || req.connection.remoteAddress;

    let [err] = await flatry( LoginTracker.create({
      token,
      ip_address,
      login_time: now,
      logout_time: null,
      user_id: user._id
    }) );
    if (err) {
      response.error(400, `Error when create login tracker`, res);
    }

    console.log( `Success Create Login Track\n` );
  },
  
  createLoginAttempt: async function (user, attempt) {
    let err;
    if (attempt === 'success') {
      [err] = await flatry( User.updateOne({ _id: user._id }, { attempt_login: 0 }) );
      if (err) {
        response.error(400, `Error when update one user`, res);
      }
    } else {
      [err] = await flatry( LoginAttempt.create({
        attempt_login: user.attempt_login + 1,
        attempt_login_time: new Date(),
        user_id: user._id
      }) );
      if (err) {
        response.error(400, `Error when create login attempt`, res);
      }

      [err] = await flatry( User.updateOne({ _id: user._id }, { attempt_login: user.attempt_login + 1 }) );
      if (err) {
        response.error(400, `Error when update one user`, res);
      }
    }
  },
  
  logout: async function (req, res) {
    console.log(`\nLOG OUT`);
    let now = momenttz.tz("Asia/Jakarta").format('DD MMM YYYY HH:mm:ss'),
    ip_address = req.header('x-forwarded-for') || req.connection.remoteAddress,
    err, find_login,
    { _id } = req.body;
    
    [err, find_login] = await flatry( LoginTracker.find({ user_id: _id, ip_address }).limit(1).sort({ created_at: 'desc' }) );
    if (err) {
      response.error(400, `Error when find login tracker`, res);
    }
    
    let login_tracker = find_login[0];
    let login_duration = moment(Date.parse(now)).diff(login_tracker.login_time, 'seconds');
    console.log(`login time: ${login_duration}s\n`);
    
    if (login_tracker) {
      [err] = await flatry( LoginTracker.updateOne({ _id: login_tracker._id }, { logout_time: now, modified_at: now }) );
      if (err) {
        response.error(400, `Error when findOne update tracker`, res);
      }
    }

    response.ok(_id, res, `success logout`);
  },
};

module.exports = AuthenticationController;
