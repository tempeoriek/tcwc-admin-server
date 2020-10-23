const Model = require('../models/cyclogenesis_checksheet'),
  UploadController = require('./UploadController'),
  file_path = `cyclogenesischecksheet`;

CyclogenesischecksheetController = {
  getAllData: async function (req, res) {
    let err, find, fields = [], data = [];
    [err, find] = await flatry( Model.find({ is_delete: false }, `kode_bibit datetime longitude latitude _id`));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData cyclogenesischecksheet`, res, err);
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
    [err, data] = await flatry( Model.findOne({ is_delete: false, _id: id })
      .populate(`cyclogenesis_checksheet_date_id`, ['dates'])
    );
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when findOne data in getdata cyclogenesischecksheet`, res, err);
    }

    let upload = await UploadController.getFile(file_path, id)
    if (upload.status == 400) {
      response.error(400, `Error when upload data in createData cyclogenesischecksheet`, res, err);
    }

    if (data) {
      //UPLOAD FILE
      data = {
        content: data,
        file_name: (upload.data.name) ? upload.data.name : null,
        file_path: (upload.data.path) ? upload.data.path : null,
        file_type: (upload.data.type) ? upload.data.type : null
      }

      response.ok(data, res, `success get all data`);
    } else {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  createData: async function (req, res) {
    if (Object.entries(req.body).length > 0) {
      let { 
        cyclogenesis_checksheet_date_id, kode_bibit , datetime,
        latitude, longitude, suspect_area_1, suspect_area_2, suspect_area_3, location_suspect_area,
        bec_current_a, bec_current_b, bec_current_c, bec_current_d, bec_current_e, bec_current_f,
        bec_current_g, bec_current_h, bec_current_i, bec_current_j, bec_trend_k, bec_trend_l,
        bec_trend_m, bec_trend_n, bec_trend_o, bec_trend_p, development_circulation_1,
        development_circulation_2, development_circulation_3, development_circulation_4, development_circulation_5, 
        ddc_6, ddc_7, ddc_8
       } = req.body, err, data;
      let new_data = { 
        cyclogenesis_checksheet_date_id, kode_bibit , datetime,
        latitude, longitude, suspect_area_1, suspect_area_2, suspect_area_3, location_suspect_area,
        bec_current_a, bec_current_b, bec_current_c, bec_current_d, bec_current_e, bec_current_f,
        bec_current_g, bec_current_h, bec_current_i, bec_current_j, bec_trend_k, bec_trend_l,
        bec_trend_m, bec_trend_n, bec_trend_o, bec_trend_p, development_circulation_1,
        development_circulation_2, development_circulation_3, development_circulation_4, development_circulation_5, 
        ddc_6, ddc_7, ddc_8
       };
    
      //CREATE DATA
      [err, data] = await flatry( Model.create( new_data ) );
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when create data in createData cyclogenesischecksheet`, res, err);
      }

      let update_result = await CyclogenesischecksheetController.updateResult(data);
      if (update_result.status == 400 && !data) {
        response.error(400, `Error when update result in createData cyclogenesischecksheet`, res, err);
      }
      data = update_result.data;

      //UPLOAD FILE
      if (req.files && data && file_path) {
        let upload = await UploadController.uploadData(req.files.files, file_path, data._id, `create`)
        if (upload.status == 400) {
          response.error(400, `Error when upload data in createData cyclogenesischecksheet`, res, err);
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
        cyclogenesis_checksheet_date_id, kode_bibit , datetime,
        latitude, longitude, suspect_area_1, suspect_area_2, suspect_area_3, location_suspect_area,
        bec_current_a, bec_current_b, bec_current_c, bec_current_d, bec_current_e, bec_current_f,
        bec_current_g, bec_current_h, bec_current_i, bec_current_j, bec_trend_k, bec_trend_l,
        bec_trend_m, bec_trend_n, bec_trend_o, bec_trend_p, development_circulation_1,
        development_circulation_2, development_circulation_3, development_circulation_4, development_circulation_5, 
        ddc_6, ddc_7, ddc_8
       } = req.body, { id } = req.params;
      let new_data = { 
        cyclogenesis_checksheet_date_id, kode_bibit , datetime,
        latitude, longitude, suspect_area_1, suspect_area_2, suspect_area_3, location_suspect_area,
        bec_current_a, bec_current_b, bec_current_c, bec_current_d, bec_current_e, bec_current_f,
        bec_current_g, bec_current_h, bec_current_i, bec_current_j, bec_trend_k, bec_trend_l,
        bec_trend_m, bec_trend_n, bec_trend_o, bec_trend_p, development_circulation_1,
        development_circulation_2, development_circulation_3, development_circulation_4, development_circulation_5, 
        ddc_6, ddc_7, ddc_8
       }, err, data, 
      filter = { _id: id, is_delete: false };

      //UPDATE DATA
      [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when findoneandupdate data in updatedata cyclogenesischecksheet`, res, err);
      }

      let update_result = await CyclogenesischecksheetController.updateResult(data);
      if (update_result.status == 400 && !data) {
        response.error(400, `Error when update result in createData cyclogenesischecksheet`, res, err);
      }
      data = update_result.data;

      //UPLOAD FILE
      if (req.files && data && file_path) {
        let upload = await UploadController.uploadData(req.files.files, file_path, data._id, `update`)
        if (upload.status == 400) {
          response.error(400, `Error when upload data in createData cyclogenesischecksheet`, res, err);
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
        response.error(400, `Error when findOneAndUpdate data in deleteData cyclogenesischecksheet`, res, err);
      }

      //UPLOAD FILE
      if (data) {
        let upload = await UploadController.deleteFile(data._id, file_path)
        if (upload.status == 400) {
          response.error(400, `Error when upload data in createData cyclogenesischecksheet`, res, err);
        }
      }

      response.ok(data, res, `success delete data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateResult: async function (data) {
    //LOGIC RESULT
    data = await data
      .populate('suspect_area_1', 'date time').populate('suspect_area_2', 'date time').populate('suspect_area_3', 'date time')
      .populate('bec_current_a', 'date time').populate('bec_current_b', 'date time').populate('bec_current_c', 'date time')
      .populate('bec_current_d', 'date time').populate('bec_current_e', 'date time').populate('bec_current_f', 'date time')
      .populate('ec_current_', 'date time').populate('bec_current_h', 'date time').populate('bec_current_i', 'date time')
      .populate('bec_current_j', 'date time').populate('sbec_trend_k2', 'date time').populate(' bec_trend_l', 'date time')
      .populate(' bec_trend_m', 'date time').populate(' bec_trend_n', 'date time').populate(' bec_trend_o', 'date time')
      .populate(' bec_trend_p', 'date time').populate('development_circulation_1', 'date time').populate('development_circulation_2', 'date time')
      .populate('development_circulation_3', 'date time').populate('development_circulation_4', 'date time').populate('development_circulation_5', 'date time')
      .populate('ddc_6', 'date time').populate('ddc_7', 'date time').populate('ddc_8', 'date time').execPopulate();
    
    let result = `result`;
    let old = {is_delete: false, _id: data._id}, update = { result }, options = {new: true};
    let [err, updata] = await flatry( Model.findOneAndUpdate(old, update, options) )
    if (err) {
      return response.back(400, {}, `Error when find and update result in updateResult`);
    }

    return response.back(200, updata, `success upload file`);
  }
};

module.exports = CyclogenesischecksheetController;