const Model = require('../models/cyclone_citra'),
  UploadController = require('./UploadController'),
  ApiController = require('./ApiController'),
  file_path = `cyclonecitra`;

CyclonecitraController = {
  getAllData: async function (req, res) {
    let err, find, fields = [], data = [];
    
    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers cyclonecitra`, res, checkHeaders.message);
    }

    [err, find] = await flatry( Model.find({ is_delete: false }));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData cyclonecitra`, res, err);
    }
    
    if (find.length > 0) {
      
      fields.push(
        { key: 'is_active', label: 'Active', sortable: true, formatter: true, sortByFormatted: true, filterByFormatted: true}, 
        { key: 'created_at', label: 'Date' },
        { key: 'file_path', label: 'File Path' },
        { key: 'actions', label: 'Actions', class: 'text-center w-15' }
      );
        
      for (let i = 0; i < find.length; i++) {
        let temp = find[i];
        
        //FIND FILE UPLOAD
        let upload = await UploadController.getFile(file_path, temp._id);
        if (upload.status == 400) {
          response.error(400, `Error when get all file in citra controller`, res, upload.messages);
        }

        data.push({
          _id: temp._id,
          created_at: (temp.created_at) ? temp.created_at : `-`,
          is_active: (temp.is_active) ? temp.is_active : `-`,
          file_name: (upload.data) ? upload.data.name : null,
          file_path: (upload.data) ? upload.data.path : null,
          file_type: (upload.data) ? upload.data.type : null
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
      response.error(400, `Error when findOne data in getdata cyclonecitra`, res, err);
    }

    //UPLOAD FILE
    let upload = await UploadController.getFile(file_path, id)
    if (upload.status == 400 && !upload.data) {
      response.error(400, `Error when upload data in createData cyclonecitra`, res, err);
    }
    
    if (data) {
      //UPLOAD FILE
      data = {
        content: data,
        file_name: (upload.data) ? upload.data.name : null,
        file_path: (upload.data) ? upload.data.path : null,
        file_type: (upload.data) ? upload.data.type : null
      }

      response.ok(data, res, `success get all data`);
    } else {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  createData: async function (req, res) {
    if (Object.entries(req.body).length > 0) {
      let { is_active } = req.body, err, data;
      let new_data = { is_active };

      [err, data] = await flatry( Model.create( new_data ));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when create data in createData cyclonecitra`, res, err);
      }

      //LOGIC UPDATE ALL FALSE
      if (is_active == true) {
        filter = {_id :{ $ne: data.id }, is_delete: false};
        new_data = {is_active: false};
        [err] = await flatry( Model.updateMany( filter, new_data, {new: true}));
        if (err) {
          console.log(err.stack);
          response.error(400, `Error when findoneandupdate data in updatedata cyclonecitra`, res, err);
        }
      }

      //UPLOAD FILE SINGLE FILE ONLY
      if (req.files && data && file_path) {
        let upload;
        upload = await UploadController.chooseUploadData(req.files, file_path, data._id, `create`)
        if (upload.status == 400) {
          response.error(400, `Error when upload data in ${file_path}`, res, err);
        }
      }

      response.ok(data, res, `success create data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateData: async function (req, res) {
    if (Object.entries(req.body).length > 0 && Object.entries(req.params).length > 0) {
      let { is_active } = req.body, { id } = req.params;
      let new_data = { is_active }, err, data, 
      filter = { _id: id, is_delete: false };
      
      [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when findoneandupdate data in updatedata cyclonecitra`, res, err);
      }
      
      //LOGIC UPDATE ALL FALSE
      if (is_active == true) {
        filter = {_id :{ $ne: id }, is_delete: false};
        new_data = {is_active: false};
        [err] = await flatry( Model.updateMany( filter, new_data, {new: true}));
        if (err) {
          console.log(err.stack);
          response.error(400, `Error when findoneandupdate data in updatedata cyclonecitra`, res, err);
        }
      }

      //UPLOAD FILE SINGLE FILE ONLY
      if (req.files && data && file_path) {
        let upload;
        upload = await UploadController.chooseUploadData(req.files, file_path, data._id, `update`)
        if (upload.status == 400) {
          return response.error(400, `Error when upload data in ${file_path}`, res, err);
        }
      } else {
        let upload = await UploadController.deleteFile(data._id, file_path)
        if (upload.status == 400) {
          return response.error(400, `Error when delete empty file ${file_path}`, res, err);
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
        response.error(400, `Error when findOneAndUpdate data in deleteData cyclonecitra`, res, err);
      }

      //UPLOAD FILE
      if (data) {
        let upload = await UploadController.deleteFile(data._id, file_path)
        if (upload.status == 400) {
          response.error(400, `Error when upload data in createData cyclonecitra`, res, err);
        }
      }

      response.ok(data, res, `success delete data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },
};

module.exports = CyclonecitraController;

