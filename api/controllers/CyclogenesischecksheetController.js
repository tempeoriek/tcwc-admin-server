const Model = require('../models/cyclogenesis_checksheet'),
  UploadController = require('./UploadController'),
  file_path = `cyclogenesischecksheet`;

CyclogenesischecksheetController = {
  getAllData: async function (req, res) {
    let err, find, fields = [], data = [];
    [err, find] = await flatry( Model.find({ is_delete: false }, `kode_bibit datetime longitude latitude _id`));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData tropicalcyclone`, res, err);
    }
    
    if (find.length > 0) {
      fields.push(
        { key: 'kode_bibit', label: 'Kode Bitbit', sortable: true },
        { key: 'datetime', label: 'Date Time', sortable: true },
        { key: 'longitude', label: 'Longitude', sortable: true },
        { key: 'latitude', label: 'Latitude', sortable: true}, 
        { key: 'actions', label: 'Actions' }
      );

      for (let i = 0; i < find.length; i++) {
        let temp = find[i];
        data.push({
          _id: temp._id,
          kode_bibit: (temp.kode_bibit) ? temp.kode_bibit : `-`,
          datetime: (temp.datetime) ? temp.datetime : `-`,
          longitude: (temp.longitude) ? temp.longitude : `-`,
          latitude: (temp.latitude) ? temp.latitude : `-`,
        })
      }
      
      response.ok(data, res, `success get all data`, fields);
    } else if (find.length == 0) {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  getData: async function (req, res) {
    let err, data, { id } = req.params;
    [err, data] = await flatry( Model.findOne({ is_delete: false, _id: id }).populate(`cyclogenesis_checksheet_date_id`));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when findOne data in getdata tropicalcyclone`, res, err);
    }

    let upload = await UploadController.getFile(file_path, id)
    if (upload.status == 400) {
      response.error(400, `Error when upload data in createData tropicalcyclone`, res, err);
    }

    data.file_name = (upload.data.name) ? upload.data.name : null;
    data.file_path = (upload.data.path) ? upload.data.path : null;
    data.file_type = (upload.data.type) ? upload.data.type : null;

    if (data) {
      response.ok(data, res, `success get all data`);
    } else {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  createData: async function (req, res) {
    if (Object.entries(req.body).length > 0) {
      let { 
        cyclogenesis_checksheet_date_id, kode_bitit , datetime,
        latitude, longitude, suspect_area_1, suspect_area_2, suspect_area_3, location_suspect_area,
        bec_current_a, bec_current_b, bec_current_c, bec_current_d, bec_current_e, bec_current_f,
        bec_current_g, bec_current_h, bec_current_i, bec_current_j, bec_trend_k, bec_trend_l,
        bec_trend_m, bec_trend_n, bec_trend_o, bec_trend_p, development_circulation_1,
        development_circulation_2, development_circulation_3, development_circulation_4, development_circulation_5, 
        ddc_6, ddc_7, ddc_8
       } = req.body, err, data;
      let new_data = { 
        cyclogenesis_checksheet_date_id, kode_bitit , datetime,
        latitude, longitude, suspect_area_1, suspect_area_2, suspect_area_3, location_suspect_area,
        bec_current_a, bec_current_b, bec_current_c, bec_current_d, bec_current_e, bec_current_f,
        bec_current_g, bec_current_h, bec_current_i, bec_current_j, bec_trend_k, bec_trend_l,
        bec_trend_m, bec_trend_n, bec_trend_o, bec_trend_p, development_circulation_1,
        development_circulation_2, development_circulation_3, development_circulation_4, development_circulation_5, 
        ddc_6, ddc_7, ddc_8, result
      };

      //LOGIC RESULT
      new_data.result = null;
      
      //CREATE DATA
      [err, data] = await flatry( Model.create( new_data ));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when create data in createData tropicalcyclone`, res, err);
      }
      
      if (req.files) {
        let upload = await UploadController.uploadData(req.files, file_path, data._id, `create`)
        if (upload.status == 400) {
          response.error(400, `Error when upload data in createData tropicalcyclone`, res, err);
        }
      }

      response.ok(data, res, `success create data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateData: async function (req, res) {
    if (Object.entries(req.body).length > 0 && Object.entries(req.params).length > 0) {
      let { 
        cyclogenesis_checksheet_date_id, kode_bitit , datetime,
        latitude, longitude, suspect_area_1, suspect_area_2, suspect_area_3, location_suspect_area,
        bec_current_a, bec_current_b, bec_current_c, bec_current_d, bec_current_e, bec_current_f,
        bec_current_g, bec_current_h, bec_current_i, bec_current_j, bec_trend_k, bec_trend_l,
        bec_trend_m, bec_trend_n, bec_trend_o, bec_trend_p, development_circulation_1,
        development_circulation_2, development_circulation_3, development_circulation_4, development_circulation_5, 
        ddc_6, ddc_7, ddc_8
       } = req.body, { id } = req.params;
      let new_data = { 
        cyclogenesis_checksheet_date_id, kode_bitit , datetime,
        latitude, longitude, suspect_area_1, suspect_area_2, suspect_area_3, location_suspect_area,
        bec_current_a, bec_current_b, bec_current_c, bec_current_d, bec_current_e, bec_current_f,
        bec_current_g, bec_current_h, bec_current_i, bec_current_j, bec_trend_k, bec_trend_l,
        bec_trend_m, bec_trend_n, bec_trend_o, bec_trend_p, development_circulation_1,
        development_circulation_2, development_circulation_3, development_circulation_4, development_circulation_5, 
        ddc_6, ddc_7, ddc_8, result
       }, err, data, 
      filter = { _id: id, is_delete: false };
      
      //LOGIC RESULT
      new_data.result = null;

      //UPDATE DATA
      [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when findoneandupdate data in updatedata tropicalcyclone`, res, err);
      }

      if (req.files) {
        let upload = await UploadController.uploadData(req.files, file_path, data._id, `update`)
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
        response.error(400, `Error when findOneAndUpdate data in deleteData tropicalcyclone`, res, err);
      }

      let upload = await UploadController.deleteData(data._id)
      if (upload.status == 400) {
        response.error(400, `Error when upload data in createData tropicalcyclone`, res, err);
      }

      response.ok(data, res, `success delete data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },
};

module.exports = CyclogenesischecksheetController;