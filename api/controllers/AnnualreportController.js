const Model = require('../models/annual_report'),
  UploadController = require('./UploadController'),
  file_path = `annualreport`;

AnnualreportController = {
  getAllData: async function (req, res) {
    let err, find, fields = [], data = [];
    [err, find] = await flatry( Model.find({ is_delete: false }, `id_title en_title path year is_posted url`));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData tropicalcyclone`, res, err);
    }
    
    if (find.length > 0) {
      fields.push(
        { key: 'year', label: 'Year', sortable: true },
        { key: 'en_title', label: 'Title', sortable: true },
        { key: 'id_title', label: 'Title (ID)', sortable: true },
        { key: 'is_posted', label: 'Posted' },
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
          id_title: (temp.id_title) ? temp.id_title : `-`,
          en_title: (temp.en_title) ? temp.en_title : `-`,
          path: (temp.path) ? temp.path : `-`,
          year: (temp.year) ? temp.year : `-`,
          is_posted: (temp.is_posted) ? temp.is_posted : `-`,
          url: (temp.url) ? temp.url : `-`,
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
    [err, data] = await flatry( Model.findOne({ is_delete: false, _id: id }));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when findOne data in getdata annualreport`, res, err);
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
      let { id_title, en_title, year, url } = req.body, err, data;
      let new_data = { id_title, en_title, year, url };

      let generated = await ApiController.generated(Model, "path", en_title);
      new_data.path = generated.data;

      
      [err, data] = await flatry( Model.create( new_data ));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when create data in createData annualreport`, res, err);
      }
      
      //UPLOAD FILE
      if (req.files && data && file_path) {
        let upload = await UploadController.uploadData(req.files.files, file_path, data._id, `create`)
        if (upload.status == 400) {
          response.error(400, `Error when upload data in createData cyclonecitra`, res, err);
        }
      }
      
      response.ok(data, res, `success create data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateData: async function (req, res) {
    if (Object.entries(req.body).length > 0 && Object.entries(req.params).length > 0) {
      let { id_title, en_title, year, url } = req.body, { id } = req.params;
      let new_data = { id_title, en_title, year, url }, err, data, 
      filter = { _id: id, is_delete: false };
      
      let generated = await ApiController.generated(Model, "path", en_title);
      new_data.path = generated.data;
      [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when findoneandupdate data in updatedata annualreport`, res, err);
      }

      //UPLOAD FILE
      if (req.files && data && file_path) {
        let upload = await UploadController.uploadData(req.files.files, file_path, data._id, `update`)
        if (upload.status == 400) {
          response.error(400, `Error when upload data in createData cyclonecitra`, res, err);
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
        response.error(400, `Error when findOneAndUpdate data in deleteData annualreport`, res, err);
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

module.exports = AnnualreportController;
