const Model = require('../models/cyclogenesis_checksheet_detail');

CyclogenesischecksheetdetaildetailController = {
  getAllData: async function (req, res) {
    let err, find, fields = [], data = [];
    [err, find] = await flatry( Model.find({ is_delete: false }).populate('cyclogenesis_checksheet_id') );
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData cyclogenesischecksheetdetail`, res, err);
    }
    
    if (find.length > 0) {
      for (let i = 0; i < find.length; i++) {
        let temp = find[i];
        data.push(temp)
      }
      response.ok(data, res, `success get all data`, fields);
    } else if (find.length == 0) {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  getData: async function (req, res) {
    let err, data, { id } = req.params;
    [err, data] = await flatry( Model.findOne({ is_delete: false, _id: id })
      .populate(`result_id`, ['result', 'suggestion'])
    );
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when findOne data in getdata cyclogenesischecksheetdetail`, res, err);
    }  

    if (data) {
      response.ok(data, res, `success get all data`);
    } else {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  createData: async function (req, res) {
    if (Object.entries(req.body).length > 0) {
      let { 
        cyclogenesis_checksheet_id,
        suspect_area_1, suspect_area_2, suspect_area_3, location_suspect_area,
        bec_current_a, bec_current_b, bec_current_c, bec_current_d, bec_current_e, bec_current_f,
        bec_current_g, bec_current_h, bec_current_i, bec_current_j, bec_trend_k, bec_trend_l,
        bec_trend_m, bec_trend_n, bec_trend_o, bec_trend_p, development_circulation_1,
        development_circulation_2, development_circulation_3, development_circulation_4, development_circulation_5, 
        ddc_6, ddc_7, ddc_8, mw_9, mw_10
       } = req.body, err, data;
      let new_data = { 
        cyclogenesis_checksheet_id,
        suspect_area_1, suspect_area_2, suspect_area_3, location_suspect_area,
        bec_current_a, bec_current_b, bec_current_c, bec_current_d, bec_current_e, bec_current_f,
        bec_current_g, bec_current_h, bec_current_i, bec_current_j, bec_trend_k, bec_trend_l,
        bec_trend_m, bec_trend_n, bec_trend_o, bec_trend_p, development_circulation_1,
        development_circulation_2, development_circulation_3, development_circulation_4, development_circulation_5, 
        ddc_6, ddc_7, ddc_8, mw_9, mw_10
       };
    
      //CREATE DATA
      [err, data] = await flatry( Model.create( new_data ) );
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when create data in createData cyclogenesischecksheetdetail`, res, err);
      }

      let update_result = await CyclogenesischecksheetdetaildetailController.updateResult(data);
      if (update_result.status == 400 && !data) {
        response.error(400, `Error when update result in createData cyclogenesischecksheetdetail`, res, err);
      }
      data = update_result.data;

      response.ok(data, res, `success create data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateData: async function (req, res) {
    if (Object.entries(req.body).length > 0 && Object.entries(req.params).length > 0) {
      let { 
        cyclogenesis_checksheet_id,
        suspect_area_1, suspect_area_2, suspect_area_3, location_suspect_area,
        bec_current_a, bec_current_b, bec_current_c, bec_current_d, bec_current_e, bec_current_f,
        bec_current_g, bec_current_h, bec_current_i, bec_current_j, bec_trend_k, bec_trend_l,
        bec_trend_m, bec_trend_n, bec_trend_o, bec_trend_p, development_circulation_1,
        development_circulation_2, development_circulation_3, development_circulation_4, development_circulation_5, 
        ddc_6, ddc_7, ddc_8, mw_9, mw_10
       } = req.body, { id } = req.params;
      let new_data = { 
        cyclogenesis_checksheet_id,
        suspect_area_1, suspect_area_2, suspect_area_3, location_suspect_area,
        bec_current_a, bec_current_b, bec_current_c, bec_current_d, bec_current_e, bec_current_f,
        bec_current_g, bec_current_h, bec_current_i, bec_current_j, bec_trend_k, bec_trend_l,
        bec_trend_m, bec_trend_n, bec_trend_o, bec_trend_p, development_circulation_1,
        development_circulation_2, development_circulation_3, development_circulation_4, development_circulation_5, 
        ddc_6, ddc_7, ddc_8, mw_9, mw_10
       }, err, data, 
      filter = { _id: id, is_delete: false };

      //UPDATE DATA
      [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when findoneandupdate data in updatedata cyclogenesischecksheetdetail`, res, err);
      }

      let update_result = await CyclogenesischecksheetdetaildetailController.updateResult(data);
      if (update_result.status == 400 && !data) {
        response.error(400, `Error when update result in createData cyclogenesischecksheetdetail`, res, err);
      }
      data = update_result.data;

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
        response.error(400, `Error when findOneAndUpdate data in deleteData cyclogenesischecksheetdetail`, res, err);
      }

      response.ok(data, res, `success delete data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateResult: async function (data) {
    //LOGIC RESULT
    let ap = 0;
    ap = (data.bec_current_a) ? ap + 1 : ap;
    ap = (data.bec_current_b) ? ap + 1 : ap;
    ap = (data.bec_current_c) ? ap + 1 : ap;
    ap = (data.bec_current_d) ? ap + 1 : ap;
    ap = (data.bec_current_e) ? ap + 1 : ap;
    ap = (data.bec_current_f) ? ap + 1 : ap;
    ap = (data.bec_current_g) ? ap + 1 : ap;
    ap = (data.bec_current_h) ? ap + 1 : ap;
    ap = (data.bec_current_i) ? ap + 1 : ap;
    ap = (data.bec_current_j) ? ap + 1 : ap;
    ap = (data.bec_trend_k) ? ap + 1 : ap;
    ap = (data.bec_trend_l) ? ap + 1 : ap;
    ap = (data.bec_trend_m) ? ap + 1 : ap;
    ap = (data.bec_trend_n) ? ap + 1 : ap;
    ap = (data.bec_trend_o) ? ap + 1 : ap;
    ap = (data.bec_trend_p) ? ap + 1 : ap;

    let result_id;
    if (ap >= 9 && data.mw_9) {
      result_id = `5fa26465d60e640770e36042`;
    } else if (data.development_circulation_2) {
      result_id = `5fa26479d60e640770e36043`;
    } else if (data.ddc_8 && ap <= 8 && data.mw_10) {
      result_id = `5fa26490d60e640770e36044`;
    } else if (data.ddc_8 && ap <= 8 && data.mw_9) {
      result_id = `5fa264bdd60e640770e36045`;
    } else if (data.ddc_6 && data.ddc_6 && ap >= 9 && data.mw_9) {
      result_id = `5fa264ced60e640770e36046`;
    } else if (data.ddc_6 && data.ddc_6 && ap >= 9 && data.mw_10) {
      result_id = `5fa264d6d60e640770e36047`;
    } else if (data.ddc_8 && ap >= 9 && data.mw_9) {
      result_id = `5fa264e4d60e640770e36048`;
    } else if (data.ddc_8 && ap >= 9 && data.mw_10) {
      result_id = `5fa264e9d60e640770e36049`;
    } else if (data.development_circulation_1 && data.development_circulation_2 && data.development_circulation_3 && data.development_circulation_4 && data.development_circulation_5 && data.ddc_6 && data.ddc_7 && data.ddc_8 && ap >= 9 && data.mw_9) {
      result_id = `5fa264f5d60e640770e3604a`;
    } else if (data.development_circulation_1 && data.development_circulation_2 && data.development_circulation_3 && data.development_circulation_4 && data.development_circulation_5 && data.ddc_6 && data.ddc_7 && data.ddc_8 && ap >= 9 && data.mw_10) {
      result_id = `5fa264fad60e640770e3604b`;
    }

    let old = {is_delete: false, _id: data._id}, update = { result_id }, options = {new: true};
    let [err, updata] = await flatry( Model.findOneAndUpdate(old, update, options).populate('result_id', ['result', 'suggestion']) )
    if (err) {
      return response.back(400, {}, `Error when find and update result in updateResult`);
    }

    return response.back(200, updata, `success upload file`);
  }
};

module.exports = CyclogenesischecksheetdetaildetailController;