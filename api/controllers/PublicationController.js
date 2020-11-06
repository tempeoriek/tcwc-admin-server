const Model = require('../models/publication');

PublicationController = {
  getAllData: async function (req, res) {
    let err, find, fields = [], data = [];
    [err, find] = await flatry( Model.find({ is_delete: false }, `id_title en_title en_paragraph id_paragraph path year author url`));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData cycloneoutlook`, res, err);
    }
    
    if (find.length > 0) {
      fields.push(
        { key: 'path', label: 'Path', sortable: true },
        { key: 'author', label: 'author', sortable: true },
        { key: 'en_title', label: 'Title', sortable: true },
        // { key: 'en_paragraph', label: 'Paragraph', class: 'w-50' },
        { key: 'is_posted', label: 'Posted' },
        { key: 'actions', label: 'Actions', class: 'text-center w-15' }
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
          year: (temp.year) ? temp.year: `-`,
          author: (temp.author) ? temp.author: `-`,
          url: (temp.url) ? temp.url: `-`,
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
      response.error(400, `Error when findOne data in getdata publication`, res, err);
    }

    if (data) {
      response.ok(data, res, `success get all data`);
    } else {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  createData: async function (req, res) {
    if (Object.entries(req.body).length > 0) {
      let { id_title, en_title, year, author, en_paragraph, id_paragraph, url } = req.body, err, data;
      let new_data = { id_title, en_title, year, author, en_paragraph, id_paragraph, url };

      let generated = await ApiController.generated(Model, "path", en_title);
      new_data.path = generated.data;
      [err, data] = await flatry( Model.create( new_data ));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when create data in createData publication`, res, err);
      }

      response.ok(data, res, `success create data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateData: async function (req, res) {
    if (Object.entries(req.body).length > 0 && Object.entries(req.params).length > 0) {
      let { id_title, en_title, year, author, en_paragraph, id_paragraph, url } = req.body, { id } = req.params;
      let new_data = { id_title, en_title, year, author, en_paragraph, id_paragraph, url }, err, data, 
      filter = { _id: id, is_delete: false };
      
      let generated = await ApiController.generated(Model, "path", en_title);
      new_data.path = generated.data;
      [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when findoneandupdate data in updatedata publication`, res, err);
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
        response.error(400, `Error when findOneAndUpdate data in deleteData publication`, res, err);
      }

      response.ok(data, res, `success delete data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },
};

module.exports = PublicationController;

