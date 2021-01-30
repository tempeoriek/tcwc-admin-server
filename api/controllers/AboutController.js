const Model = require('../models/about'),
  file_path = `about`,
  ApiController = require('./ApiController');

AboutController = {
  csv: async function (req, res) {
    let obj = [],
    fields = [
      { value: 'en_title', label: 'Title (ENG)'},
      { value: 'id_title', label: 'Title (IND)'},
      { value: 'start_post', label: 'Date Posted'},
      { value: 'is_posted', label: 'Posted'}
    ];

    let [err, find] = await flatry(Model.find({ is_delete: false }, `start_post en_title id_title is_posted`));
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

    [err, find] = await flatry( Model.find({ is_delete: false }, `id_title en_title en_paragraph id_paragraph path is_posted start_post`));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData cycloneoutlook`, res, err);
    }
    
    if (find.length > 0) {
      fields.push(
        { key: 'en_title', label: 'Topic Name (ENG)', sortable: true },
        { key: 'id_title', label: 'Topic Name (IND)', sortable: true },
        { key: 'start_post', label: 'Date Posted', sortable: true },
        { key: 'is_posted', label: 'Posted', sortable: true, formatter: true, sortByFormatted: true, filterByFormatted: true}, 
        { key: 'actions', label: 'Actions', class: 'text-center w-15'}
      );

      for (let i = 0; i < find.length; i++) {
        let temp = find[i];
        data.push({
          _id: temp._id,
          id_title: (temp.id_title) ? temp.id_title : `-`,
          en_title: (temp.en_title) ? temp.en_title : `-`,
          id_paragraph: (temp.id_paragraph) ? temp.id_paragraph : `-`,
          en_paragraph: (temp.en_paragraph) ? temp.en_paragraph : `-`,
          path: (temp.path) ? temp.path : `-`,
          start_post: (temp.start_post) ? temp.start_post : `-`,
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
    
    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers cyclonecitra`, res, checkHeaders.message);
    }

    [err, data] = await flatry( Model.findOne({ is_delete: false, _id: id }));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when findOne data in getdata about`, res, err);
    }

    if (data) {
      response.ok(data, res, `success get all data`);
    } else {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  createData: async function (req, res) {
    if (Object.entries(req.body).length > 0) {
      let { id_title, id_paragraph, en_title, en_paragraph, is_posted, start_post } = req.body, err, data;
      let new_data = { id_title, id_paragraph, en_title, en_paragraph, is_posted, start_post };

      let generated = await ApiController.generated(Model, "path", en_title);
      new_data.path = generated.data;
      [err, data] = await flatry( Model.create( new_data ));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when create data in createData about`, res, err);
      }

      response.ok(data, res, `success create data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateData: async function (req, res) {
    if (Object.entries(req.body).length > 0 && Object.entries(req.params).length > 0) {
      let { id_title, id_paragraph, en_title, en_paragraph, is_posted, start_post } = req.body, { id } = req.params;
      let new_data = { id_title, id_paragraph, en_title, en_paragraph, is_posted, start_post }, err, data, 
      filter = { _id: id, is_delete: false };
      
      let generated = await ApiController.generated(Model, "path", en_title);
      new_data.path = generated.data;
      [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when findoneandupdate data in updatedata about`, res, err);
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
        response.error(400, `Error when findOneAndUpdate data in deleteData about`, res, err);
      }

      response.ok(data, res, `success delete data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },
};

module.exports = AboutController;

