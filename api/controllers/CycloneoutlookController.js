const Model = require('../models/cyclone_outlook'),
  UploadController = require('./UploadController'),
  ApiController = require('./ApiController'),
  file_path = `cycloneoutlook`;


CycloneoutlookController = {
  pdf: async function (req, res) {
    let { id } = req.body, err, find, data, upload;
    let filter = { is_delete: false, _id: id };
    [err, find] = await flatry( Model.findOne( filter ));
    if (err || !find) {
      console.log(err);
      response.error(400, `Error when find data in pdf cycloneoutlook or data not found`, res, err);
    }

    let today = moment.utc().format(`YYYYMMDDHHMMSS`);
    let name_pdf = `${file_path}-${today}`;

    if (find) {
      let create_pdf = await ApiController.generatePDF(find.en_paragraph, file_path, name_pdf);
      if (create_pdf.status == 400) {
        response.error(400, `Error when create pdf`, res, create_pdf.message);
      }
      
      //CREATE PDF INTO DB
      if (create_pdf.data && file_path) {
        let obj = { name: name_pdf, path: create_pdf.data.filename, type: `pdf`}
        upload = await UploadController.createPDF(obj, file_path, find._id, `create`)
        if (upload.status == 400) {
          response.error(400, `Error when upload data in createData cyclonecitra`, res, err);
        }
      }

      data = upload.data;
      response.ok(data, res, `success create pdf`);
    }
  },

  posted: async function (req, res) {
    let err, data, old_data, old = { is_posted: false, is_delete: false }, updated = { is_posted: true, is_delete: false };
    [err, old_data] = await flatry( Model.findOne( old, "en_paragraph id_paragraph is_posted"));
    if (err) {
      response.error(400, `Error when copy data in cyclone outlook posted`, res, err);
    }
   
    if (old_data) {
      let new_data = {
        en_paragraph: old_data.en_paragraph,
        id_paragraph: old_data.id_paragraph,
        modified_at: moment.utc().format(`YYYY-MM-DDTHH:mm:ss.SSSZ`)
      }, options = {new: true};

      [err, data] = await flatry( Model.findOneAndUpdate( updated, new_data, options ));
      if (err) {
        response.error(400, `Error when copy data in cyclone outlook posted`, res, err);
      }

      response.ok(data, res, `success copy data`);
    } else {
      response.success(data, res, `success copy data but data is empty`);
    }
  },

  getAllData: async function (req, res) {
    let err, find, fields = null, data = [];
    [err, find] = await flatry( Model.find({ is_delete: false }, `id_paragraph en_paragraph is_posted`));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData cycloneoutlook`, res, err);
    }
    
    if (find.length > 0) {
      for (let i = 0; i < find.length; i++) {
        let temp = find[i];
        data.push({
          _id: temp._id,
          id_paragraph: (temp.id_paragraph) ? temp.id_paragraph : `-`,
          en_paragraph: (temp.en_paragraph) ? temp.en_paragraph : `-`,
          is_posted: (temp.is_posted) ? temp.is_posted : `-`,
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
      response.error(400, `Error when findOne data in getdata cycloneoutlook`, res, err);
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
      let { en_paragraph, id_paragraph, is_posted } = req.body, err, data;
      let new_data = {  en_paragraph, id_paragraph, is_posted };

      [err, data] = await flatry( Model.create( new_data ));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when create data in createData cycloneoutlook`, res, err);
      }

      /* if (req.files && data && file_path) {
        let upload = await UploadController.uploadData(req.files.files, file_path, data._id, `create`)
        if (upload.status == 400) {
          response.error(400, `Error when upload data in createData cyclonecitra`, res, err);
        }
      } */

      response.ok(data, res, `success create data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateData: async function (req, res) {
    if (Object.entries(req.body).length > 0 && Object.entries(req.params).length > 0) {
      let { en_paragraph, id_paragraph, is_posted } = req.body, { id } = req.params;
      let new_data = { modified_at: moment.utc().format(`YYYY-MM-DDTHH:mm:ss.SSSZ`), en_paragraph, id_paragraph, is_posted }, err, data, 
      filter = { _id: id, is_delete: false };
      
      [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when findoneandupdate data in updatedata cycloneoutlook`, res, err);
      }
      
      /* //UPLOAD FILE
      if (req.files && data && file_path) {
        let upload = await UploadController.uploadData(req.files.files, file_path, data._id, `update`)
        if (upload.status == 400) {
          response.error(400, `Error when upload data in createData cyclonecitra`, res, err);
        }
      } */
      
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
        response.error(400, `Error when findOneAndUpdate data in deleteData cycloneoutlook`, res, err);
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

module.exports = CycloneoutlookController;
