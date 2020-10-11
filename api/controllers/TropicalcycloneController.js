const Model = require('../models/tropical_cyclone');

TropicalcycloneController = {
  getAllData: async function (req, res) {
    let err, find, fields = [], data = [];
    [err, find] = await flatry( Model.find({ is_delete: false }, `name year area is_active _id`));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData tropicalcyclone`, res, err);
    }
    
    if (find.length > 0) {
      fields.push(
        { key: 'name', label: 'TC Name', sortable: true, sortDirection: 'desc' },
        { key: 'year', label: 'Year', sortable: true },
        { key: 'area', label: 'Area', sortable: true },
        { key: 'is_active', label: 'Status', sortable: true, formatter: true, sortByFormatted: true, filterByFormatted: true}, 
        { key: 'actions', label: 'Actions' }
      );

      for (let i = 0; i < find.length; i++) {
        let temp = find[i];
        data.push({
          _id: temp._id,
          name: (temp.name) ? temp.name : `-`,
          year: (temp.year) ? temp.year : `-`,
          area: (temp.area) ? temp.area : `-`,
          is_active: (temp.is_active) ? temp.is_active : `-`,
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
      response.error(400, `Error when findOne data in getdata tropicalcyclone`, res, err);
    }

    if (data) {
      response.ok(data, res, `success get all data`);
    } else {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  createData: async function (req, res) {
    if (Object.entries(req.body).length > 0) {
      let { name, year, area, is_active, techincal_bulletin, public_info_bulletin, ocean_gale_storm_warn, track_impact, coastal_zone, extreme_weather, gale_warning } = req.body, err, data;
      let new_data = { name, year, area, is_active, techincal_bulletin, public_info_bulletin, ocean_gale_storm_warn, track_impact, coastal_zone, extreme_weather, gale_warning };

      [err, data] = await flatry( Model.create( new_data ));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when create data in createData tropicalcyclone`, res, err);
      }

      response.ok(data, res, `success create data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateData: async function (req, res) {
    if (Object.entries(req.body).length > 0 && Object.entries(req.params).length > 0) {
      let { name, year, area, is_active, max_wind_speed, techincal_bulletin, public_info_bulletin, ocean_gale_storm_warn, track_impact, coastal_zone, extreme_weather, gale_warning } = req.body, { id } = req.params;
      let new_data = { name, year, area, is_active, max_wind_speed, techincal_bulletin, public_info_bulletin, ocean_gale_storm_warn, track_impact, coastal_zone, extreme_weather, gale_warning }, err, data, 
      filter = { _id: id, is_delete: false };
      
      [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when findoneandupdate data in updatedata tropicalcyclone`, res, err);
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
        console.log(err.stackE);
        response.error(400, `Error when findOneAndUpdate data in deleteData tropicalcyclone`, res, err);
      }

      response.ok(data, res, `success delete data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },
};

module.exports = TropicalcycloneController;

