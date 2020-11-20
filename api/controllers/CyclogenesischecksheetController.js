const Model = require('../models/cyclogenesis_checksheet'),
  UploadController = require('./UploadController'),
  ApiController = require('./ApiController'),
  file_path = `cyclogenesischecksheet`;

CyclogenesischecksheetController = {
  getAllData: async function (req, res) {
    let err, find, fields = [], data = [];
    [err, find] = await flatry( Model.find({ is_delete: false }));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData cyclogenesischecksheet`, res, err);
    }
    
    if (find.length > 0) {
      fields.push(
        { key: 'kode_bibit', label: 'Kode Bibit', sortable: true },
        { key: 'date', label: 'Date Time', sortable: true },
        { key: 'longitude', label: 'Longitude', sortable: true },
        { key: 'latitude', label: 'Latitude', sortable: true}, 
        { key: 'actions', label: 'Actions' }
      );

      for (let i = 0; i < find.length; i++) {
        let temp = find[i];
        data.push(temp)
      }
      
      response.ok(data, res, `success get all data`, fields);
    } else if (find.length == 0) {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  getData: async function (req, res) {
    let err, data, { id } = req.params, child_fields = [], childs = [];
    [err, data] = await flatry( Model.findOne({ is_delete: false, _id: id }) );
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when findOne data in getdata cyclogenesischecksheet`, res, err);
    }

    //UPLOAD FILE
    let upload = await UploadController.getMultipleFile(file_path, id)
    if (upload.status == 400 && !upload.data) {
      response.error(400, `Error when upload data in createData tropicalcyclone`, res, err);
    }

    if (data) {
      //GET ALL CHILD
      let child = await ApiController.getChildFromParent(`Cyclogenesischecksheetdetail`, data._id, file_path, null);
      if (child.status == 400) {
        response.error(400, child.message, res, child.message);
      }

      for (let i = 0; i < child.data.length; i++) {
        let temp = child.data[i];
        childs.push(temp)
      }

      //UPLOAD FILE
      data = {
        content: data,
        childs,
        child_fields,
        files : (upload.data.length > 0) ? upload.data : null
      }
      response.ok(data, res, `success get all data`);
    } else {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  createData: async function (req, res) {
    console.log(req.body)
    if (Object.entries(req.body).length > 0) {
      let {  kode_bibit , date, time, latitude, longitude } = req.body, err, data;
      let convert = await ApiController.convert(latitude, longitude);
      let new_data = { kode_bibit , date, time, latitude, longitude, latitude_dd: convert.data.lat, longitude_dd: convert.data.lng };
    
      //CREATE DATA
      [err, data] = await flatry( Model.create( new_data ) );
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when create data in createData cyclogenesischecksheet`, res, err);
      }
      
      //UPLOAD FILE FOR MULTIPLE AND SINGLE UPLOAD FILE
      if (req.files && data && file_path) {
        let upload;
        if (req.files.files.length >= 2) {
          for (let i = 0 ; i < req.files.files.length ; i ++) {
            let temp = req.files.files[i]
            upload = await UploadController.uploadData(temp, file_path, data._id, `create`)
            if (upload.status == 400) {
              response.error(400, `Error when upload data in createData tropicalcyclone`, res, err);
            }  
          }
        } else if (req.files.files.length == undefined) {
          upload = await UploadController.uploadData(req.files.files, file_path, data._id, `create`)
          if (upload.status == 400) {
            response.error(400, `Error when upload data in createData tropicalcyclone`, res, err);
          }
        }
      }

      response.ok(data, res, `success create data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateData: async function (req, res) {
    if (Object.entries(req.body).length > 0 && Object.entries(req.params).length > 0) {
      let {  kode_bibit , date, time, latitude, longitude } = req.body, { id } = req.params;
      let convert = await ApiController.convert(latitude, longitude);
      let new_data = { kode_bibit , date, time, latitude, longitude, latitude_dd: convert.data.lat, longitude_dd: convert.data.lng }, err, data, 
      filter = { _id: id, is_delete: false };

      //UPDATE DATA
      [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when findoneandupdate data in updatedata cyclogenesischecksheet`, res, err);
      }
      
      //UPLOAD FILE
      if (req.files && data && file_path) {
        let upload = await UploadController.uploadData(req.files.files, file_path, data._id, `update`)
        if (upload.status == 400) {
          response.error(400, `Error when upload data in createData tropicalcyclone`, res, err);
        }
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
        response.error(400, `Error when findOneAndUpdate data in deleteData cyclogenesischecksheet`, res, err);
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
  }
};

module.exports = CyclogenesischecksheetController;