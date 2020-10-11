const Model = require('../models/user');

UserController = {
  getAllData: async function (req, res) {
    let err, find, fields = [], data = [];
    [err, find] = await flatry( Model.find({ is_delete: false }, `username is_view is_admin is_super_admin`));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData user`, res, err);
    }
    
    if (find.length > 0) {
      fields.push(
        { key: 'username', label: 'Username', sortable: true },
        { key: 'is_admin', label: 'Admin Access', sortable: true, formatter: true, sortByFormatted: true, filterByFormatted: true},
        { key: 'is_super_admin', label: 'Super Admin Access', sortable: true, formatter: true, sortByFormatted: true, filterByFormatted: true},
        { key: 'is_view', label: 'User Access', sortable: true, formatter: true, sortByFormatted: true, filterByFormatted: true},
        { key: 'actions', label: 'Actions' }
      );

      for (let i = 0; i < find.length; i++) {
        let temp = find[i];
        data.push({
          _id: temp._id,
          username: (temp.username) ? temp.username : `-`,
          is_admin: (temp.is_admin) ? temp.is_admin : `-`,
          is_super_admin: (temp.is_super_admin) ? temp.is_super_admin : `-`,
          is_view: (temp.is_view) ? temp.is_view : `-`,
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
      response.error(400, `Error when findOne data in getdata user`, res, err);
    }

    if (data) {
      response.ok(data, res, `success get all data`);
    } else {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  createData: async function (req, res) {
    if (Object.entries(req.body).length == 0) {
    // if (Object.entries(req.body).length > 0) {

      let err, finduser, 
      { password, /* confirm_password, */ username } = req.body;
      let data = { username : `admin`, password : `admin`, is_view: false, is_admin: false, is_super_admin: true };
      let confirm_password = `admin`;
    
      if (data.password !== confirm_password) {
        response.error(400, `Password do not match.`, res);
      }
    
      [err, finduser] = await flatry( Model.findOne({ username, is_delete: false }) );
      if (err) {
        response.error(400, `ERROR:Error when findOne User`, res);
      }
    
      if (finduser) {
        response.error(400, `Email already in use, please try different email.`, res);
      } else {
        bcrypt.genSalt(10, function(err, salt){
          if(err){
            response.error(400, `Error when bycrypt gen.`, res);
          }
          bcrypt.hash(data.password, salt, async function(err, hash){
            if(err){
              response.error(400, `Error when bycrypt hash.`, res);
            }
            data.password = hash;
            await flatry( Model.create( data ) );
            response.ok(data, res, `success create user`);
          });
        });
      }

    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateData: async function (req, res) {
    if (Object.entries(req.body).length > 0 && Object.entries(req.params).length > 0) {
      let { username, password, is_admin, is_super_admin, is_view } = req.body, { id } = req.params;
      let new_data = { username, password, is_admin, is_super_admin, is_view }, err, data, 
      filter = { _id: id, is_delete: false };
      
      [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when findoneandupdate data in updatedata user`, res, err);
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
        response.error(400, `Error when findOneAndUpdate data in deleteData user`, res, err);
      }

      response.ok(data, res, `success delete data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  }
};

module.exports = UserController;

