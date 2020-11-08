const Model = require('../models/file_upload');

UploadController = {
  
  createPDF: async function (files, path, model_id, doing) {
    let new_data = {
      name: files.name,
      path: files.path,
      type: files.type,
      size: null,
      cyclone_outlook_id: (path == `cycloneoutlook`) ? model_id : null
    }, err, data;

    if (doing == `create`) {
      [err, data] = await flatry( Model.create( new_data ));
      if (err) {
        return response.back(400, {}, `Error when create file upload`);
      }
    } else if (doing == `update`) {
      let old = (path == `cycloneoutlook`) ? {cyclone_outlook_id: model_id, is_delete: false} : null;
      [err, data] = await flatry( Model.findOneAndUpdate( old, new_data ));
      if (err) {
        return response.back(400, {}, `Error when create file upload`);
      }
    }

    return response.back(200, data, `success upload file`);
  },

  uploadData: async function (files, path, model_id, doing) {
    let new_data = {
      name: files.name,
      path: `/files/${path}/${files.name}`,
      type: files.mimetype,
      size: files.size,
      tropical_cyclone_id: (path == `tropicalcyclone`) ? model_id : null,
      annual_report_id: (path == `annualreport`) ? model_id : null,
      after_event_report_id: (path == `aftereventreport`) ? model_id : null,
      cyclone_outlook_id: (path == `cycloneoutlook`) ? model_id : null,
      about_id: (path == `about`) ? model_id : null,
      cyclogenesis_checksheet_id: (path == `cyclogenesischecksheet`) ? model_id : null,
      cyclone_citra_id: (path == `cyclonecitra`) ? model_id : null,
      publication_id: (path == `publication`) ? model_id : null
    }, err, data;

    if (!files) {
      return response.back(400, {}, `file is not found`);
    }

    let myFile = files;
    err = await myFile.mv(`./files/${path}/${myFile.name}`);
    if (err) {
      return response.back(400, {}, `Error when mv file`);
    }

    if (doing == `create`) {
      [err, data] = await flatry( Model.create( new_data ));
      if (err) {
        return response.back(400, {}, `Error when create file upload`);
      }
    } else if (doing == `update`) {
      let old = (path == `tropicalcyclone`) ? {tropical_cyclone_id: model_id, is_delete: false} :
      (path == `annualreport`) ? {annual_report_id: model_id, is_delete: false} :
      (path == `aftereventreport`) ? {after_event_report_id: model_id, is_delete: false} :
      (path == `cycloneoutlook`) ? {cyclone_outlook_id: model_id, is_delete: false} :
      (path == `about`) ? {about_id: model_id, is_delete: false} :
      (path == `cyclogenesischecksheet`) ? {cyclogenesis_checksheet_id: model_id, is_delete: false} :
      (path == `cyclonecitra`) ? {cyclone_citra_id: model_id, is_delete: false} :
      (path == `publication`) ? {publication_id: model_id, is_delete: false} : null;

      [err, data] = await flatry( Model.findOneAndUpdate( old, new_data ));
      if (err) {
        return response.back(400, {}, `Error when create file upload`);
      }
    }

    return response.back(200, data, `success upload file`);
  }, 
  
  getFile: async function (path, model_id) {
    let old = (path == `tropicalcyclone`) ? {tropical_cyclone_id: model_id, is_delete: false} :
      (path == `annualreport`) ? {annual_report_id: model_id, is_delete: false} :
      (path == `aftereventreport`) ? {after_event_report_id: model_id, is_delete: false} :
      (path == `cycloneoutlook`) ? {cyclone_outlook_id: model_id, is_delete: false} :
      (path == `about`) ? {about_id: model_id, is_delete: false} :
      (path == `cyclogenesischecksheet`) ? {cyclogenesis_checksheet_id: model_id, is_delete: false} :
      (path == `cyclonecitra`) ? {cyclone_citra_id: model_id, is_delete: false} :
      (path == `cyclonename`) ? {cyclone_name_id: model_id, is_delete: false} :
      (path == `cyclonedescription`) ? {cyclone_description_id: model_id, is_delete: false} :
      (path == `cyclonecurrent`) ? {cyclone_current_id: model_id, is_delete: false} :
      (path == `markdown`) ? {_id: model_id, is_delete: false} :
      (path == `publication`) ? {publication_id: model_id, is_delete: false} : null;

    if (old) {
      let [err, data] = await flatry( Model.findOne( old, `name type path` ));
      if (err) {
        return response.back(400, {}, `Error when create file upload`);
      }  
      
      return response.back(200, data, `success get file`);
    } else {
      return response.back(400, {}, `Error when create file upload, body is null`);
    }
  },

  deleteFile: async function(model_id, path) {
    let old = (path == `tropicalcyclone`) ? {tropical_cyclone_id: model_id, is_delete: false} :
      (path == `annualreport`) ? {annual_report_id: model_id, is_delete: false} :
      (path == `aftereventreport`) ? {after_event_report_id: model_id, is_delete: false} :
      (path == `cycloneoutlook`) ? {cyclone_outlook_id: model_id, is_delete: false} :
      (path == `about`) ? {about_id: model_id, is_delete: false} :
      (path == `cyclogenesischecksheet`) ? {cyclogenesis_checksheet_id: model_id, is_delete: false} :
      (path == `cyclonecitra`) ? {cyclone_citra_id: model_id, is_delete: false} :
      (path == `publication`) ? {publication_id: model_id, is_delete: false} : null;

    [err] = await flatry( Model.updateMany( old, { is_delete: true } ));
    if (err) {
      return response.back(400, {}, `Error when delete file upload`);
    }  

    return response.back(200, null, `success delete file`);
  },

  upload: async function(req, res) {
    let { file_path } = req.query, upload, data = null;
    if (req.files && file_path) {
      upload = await UploadController.uploadData(req.files.upload, file_path, null, `create`)
      if (upload.status == 400) {
        response.error(400, `Error when upload data in createData cyclonecitra`, res, err);
      }
      data = {url: `http://api.tcwc.tivedemo.com/${file_path}/${upload.data.name}`}
    }
    response.send(data);
  },

  get: async function(req, res) {
    let { file_path, id } = req.query, data;
    let upload = await UploadController.getFile(file_path, id)
    if (upload.status == 400 && !upload.data) {
      response.error(400, `Error when upload data in createData cyclonecitra`, res, err);
    }
    data = (upload.data) ? upload.data : null;
    response.ok(data, res, `success upload data`);
  },
};

module.exports = UploadController;

