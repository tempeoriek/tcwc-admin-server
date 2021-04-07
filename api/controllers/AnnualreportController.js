const Model = require('../models/annual_report'),
  UploadController = require('./UploadController'),
  ApiController = require('./ApiController'),
  file_path = `annualreport`;
 
AnnualreportController = {
  csv: async function (req, res) {
    let obj = [],
    fields = [
      { value: 'year', label: 'Year'},
      { value: 'en_title', label: 'Title (ENG)'},
      { value: 'id_title', label: 'Title (IND)'},
      { value: 'is_posted', label: 'Posted'}
    ];

    let [err, find] = await flatry(Model.find({ is_delete: false }, `year en_title id_title is_posted`));
    if (err) {
      return response.error(400, `Error when find data in csv ${file_path}`, res, err);
    }

    if (find.length>0) {
      for (let i = 0 ; i < find.length; i++) {
        let temp = find[i];
        obj.push({
          id_title: (temp.id_title) ? temp.id_title : `-`,
          en_title: (temp.en_title) ? temp.en_title : `-`,
          year: (temp.year) ? temp.year : `-`,
          is_posted: (temp.is_posted) ? temp.is_posted : `-`,
        });
      }

      let create_csv = await ApiController.generateCSV(obj, fields, file_path)
      if (create_csv.status == 400) {
        return response.error(400, `Error when create csv`, res, create_csv.message);
      }

      let obj_upload = { name: create_csv.data.name, path: create_csv.data.path, type: `csv`}
      let upload = await UploadController.createExternalFile(obj_upload, null, null, `create`)
      if (upload.status == 400) {
        return response.error(400, `Error when upload data csv ${file_path}`, res, err);
      }
      return response.ok(upload.data, res, `Success Create CSV File`, null);
    } else {
      return response.success(null, res, `Empty data`, null);
    }
  },

  getAllData: async function (req, res) {
    let err, find, fields = [], data = [];
    
    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers cyclonecitra`, res, checkHeaders.message);
    }

    [err, find] = await flatry( Model.find({ is_delete: false }, `id_title en_title path year is_posted url`));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData tropicalcyclone`, res, err);
    }
    
    if (find.length > 0) {
      fields.push(
        { key: 'year', label: 'Year', sortable: true },
        { key: 'en_title', label: 'Title (ENG)', sortable: true },
        { key: 'id_title', label: 'Title (IND)', sortable: true },
        { key: 'is_posted', label: 'Posted', sortable: true, formatter: true, sortByFormatted: true, filterByFormatted: true}, 
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

    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers cyclonecitra`, res, checkHeaders.message);
    }

    [err, data] = await flatry( Model.findOne({ is_delete: false, _id: id }));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when findOne data in getdata annualreport`, res, err);
    }

    //UPLOAD FILE
    let upload = await UploadController.getFile(file_path, id)
    if (upload.status == 400 && !upload.data) {
      response.error(400, `Error when upload data in createData annual report`, res, err);
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
      let { id_title, en_title, year, url, is_posted } = req.body, err, data;
      let new_data = { id_title, en_title, year, url, is_posted };

      let generated = await ApiController.generated(Model, "path", en_title);
      new_data.path = generated.data;

      
      [err, data] = await flatry( Model.create( new_data ));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when create data in createData annualreport`, res, err);
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
      let { id_title, en_title, year, url, is_posted } = req.body, { id } = req.params;
      let new_data = { id_title, en_title, year, url, is_posted }, err, data, 
      filter = { _id: id, is_delete: false };
      
      let generated = await ApiController.generated(Model, "path", en_title);
      new_data.path = generated.data;
      [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when findoneandupdate data in updatedata annualreport`, res, err);
      }

      //UPLOAD FILE SINGLE FILE ONLY
      if (req.files && data && file_path) {
        let upload;
        upload = await UploadController.chooseUploadData(req.files, file_path, data._id, `update`)
        if (upload.status == 400) {
          return response.error(400, `Error when upload data in ${file_path}`, res, err);
        }
      }

      for (const [key, value] of Object.entries(req.body)) {
        if (key.includes(`file`) || key.includes(file_path)) {
          let attr = key.includes(`file`)  ? key : key.includes(file_path) ? file_path : null;
          if (value != `null` && attr) {
            let upload = await UploadController.deleteFile(value, attr)
            if (upload.status == 400) {
              return response.error(400, `Error when delete empty file ${file_path}`, res, err);
            }
          }
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
          response.error(400, `Error when upload data in createData annual report`, res, err);
        }
      }

      response.ok(data, res, `success delete data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },
};

module.exports = AnnualreportController;
