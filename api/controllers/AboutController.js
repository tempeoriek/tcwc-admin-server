const Model = require('../models/about');

AboutController = {
  filterData: async function (req, res) {
    let err, data, { filter, sort } = req.body;
    let find_data = (filter) ? filter : {is_delete: false},
    sort_data = (sort) ? sort : { "created_at": 1 };
    [err, data] = await flatry( Model.find( find_data, 'year' ).sort(sort_data));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when filter data in tropicalcyclone`, res, err);
    }

    response.ok(data, res, `success get filter data`);
  },
  
  getAllData: async function (req, res) {
    let err, find, fields = [], data = [];
    [err, find] = await flatry( Model.find({ is_delete: false }, `id_title is_posted start_post`));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData cycloneoutlook`, res, err);
    }
    
    if (find.length > 0) {
      fields.push(
        { key: 'id_title', label: 'Topic Name', sortable: true },
        { key: 'start_post', label: 'Date Posted', sortable: true },
        { key: 'is_posted', label: 'Status', sortable: true, formatter: true, sortByFormatted: true, filterByFormatted: true}, 
        { key: 'actions', label: 'Actions' }
      );

      for (let i = 0; i < find.length; i++) {
        let temp = find[i];
        data.push({
          _id: temp._id,
          id_title: (temp.id_title) ? temp.id_title : `-`,
          en_title: (temp.en_title) ? temp.en_title : `-`,
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
      let { id_title, id_paragraph, en_title, en_paragraph, is_posted, path } = req.body, err, data;
      let new_data = { id_title, id_paragraph, en_title, en_paragraph, is_posted, path };

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
      let { id_title, id_paragraph, en_title, en_paragraph, is_posted, path } = req.body, { id } = req.params;
      let new_data = { id_title, id_paragraph, en_title, en_paragraph, is_posted, path }, err, data, 
      filter = { _id: id, is_delete: false };
      
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

