const Model = require('../models/after_event_report'),
  Tropical = require('../models/tropical_cyclone');

AftereventreportController = {
  getAllData: async function (req, res) {
    let err, find, fields = [], data = [];
    [err, find] = await flatry( Model.find({ is_delete: false }, `id_title en_title en_paragraph id_paragraph path year url is_posted tropical_cyclone_id`).populate(`tropical_cyclone_id`, [`name`]));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData cycloneoutlook`, res, err);
    }
    
    if (find.length > 0) {
      fields.push(
	{ key: 'path', label: 'Path', sortable: true },
        { key: 'name', label: 'TC Name', sortable: true },
        { key: 'year', label: 'Year', sortable: true },
        { key: 'en_title', label: 'Title', sortable: true },
        { key: 'en_paragraph', label: 'Paragraph', class: 'w-50' },
        { key: 'is_posted', label: 'Posted' },
        { key: 'actions', label: 'Actions', class: 'text-center w-15' }
      );

      for (let i = 0; i < find.length; i++) {
        let temp = find[i];
        data.push({
          _id: temp._id,

	   is_posted: (temp.is_posted) ? temp.is_posted: `-`,
          name: (temp.tropical_cyclone_id) ? temp.tropical_cyclone_id.name: `-`,
          year: (temp.year) ? temp.year: `-`,
          id_title: (temp.id_title) ? temp.id_title : `-`,
          en_title: (temp.en_title) ? temp.en_title : `-`,
          id_paragraph: (temp.id_paragraph) ? temp.id_paragraph : `-`,
          en_paragraph: (temp.en_paragraph) ? temp.en_paragraph : `-`,
          path: (temp.path) ? temp.path : `-`,
          url: (temp.url) ? temp.url : `-`,
        })
      }

      response.ok(data, res, `success get all data`, fields);
    } else if (find.length == 0) {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  getData: async function (req, res) {
    let err, data, { id } = req.params;
    [err, data] = await flatry( Model.findOne({ is_delete: false, _id: id }).populate('tropical_cyclone_id', [`name`]));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when findOne data in getdata aftereventreport`, res, err);
    }

    if (data) {
      response.ok(data, res, `success get all data`);
    } else {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  createData: async function (req, res) {
    if (Object.entries(req.body).length > 0) {
      let { tropical_cyclone_id, id_paragraph, year, path, en_paragraph, id_title, en_title, url } = req.body, err, data;
      let new_data = { tropical_cyclone_id, id_paragraph, year, path, en_paragraph, id_title, en_title, url };
      
      let redundant = await ApiController.redundant(Model, "path", path);
      if (redundant.status == 201) {
        response.error(400, redundant.message, res, redundant.message);
      }
      
      
      if (redundant.status == 200) {
        [err, data] = await flatry( Model.create( new_data ));
        if (err) {
          console.log(err.stack);
          response.error(400, `Error when create data in createData aftereventreport`, res, err);
        }

        response.ok(data, res, `success create data`);
      }
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateData: async function (req, res) {
    if (Object.entries(req.body).length > 0 && Object.entries(req.params).length > 0) {
      let { tropical_cyclone_id, id_paragraph, year, path, en_paragraph, id_title, en_title, url } = req.body, { id } = req.params;
      let new_data = { tropical_cyclone_id, id_paragraph, year, path, en_paragraph, id_title, en_title, url }, err, data, 
      filter = { _id: id, is_delete: false };
      
      let redundant = await ApiController.redundant(Model, "path", path);
      if (redundant.status == 201) {
        response.error(400, redundant.message, res, redundant.message);
      }
      
      if (redundant.status == 200) {
        [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
        if (err) {
          console.log(err.stack);
          response.error(400, `Error when findoneandupdate data in updatedata aftereventreport`, res, err);
        }
  
        response.ok(data, res, `success update data`);
      }
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
        response.error(400, `Error when findOneAndUpdate data in deleteData aftereventreport`, res, err);
      }

      response.ok(data, res, `success delete data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  getTropicalCylone: async function (req, res) {
    let err, data;
    [err, data] = await flatry( Tropical.find({ is_delete: false }));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData aftereventreport`, res, err);
    }
    
    if (data.length > 0) {
      response.ok(data, res, `success get all data`);
    } else if (data.length == 0) {
      response.success(data, res, `success get all data but data is empty`);
    }
  }
};

module.exports = AftereventreportController;
