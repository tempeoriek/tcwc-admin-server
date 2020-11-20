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
      techincal_bulletin_id: (path == `techincal_bulletin`) ? model_id : null,
      public_info_bulletin_id: (path == `public_info_bulletin`) ? model_id : null,
      ocean_gale_storm_warn_id: (path == `ocean_gale_storm_warn`) ? model_id : null,
      track_impact_id: (path == `track_impact`) ? model_id : null,
      coastal_zone_id: (path == `coastal_zone`) ? model_id : null,
      extreme_weather_id: (path == `extreme_weather`) ? model_id : null,
      gale_warning_id: (path == `gale_warning`) ? model_id : null,
      annual_report_id: (path == `annualreport`) ? model_id : null,
      after_event_report_id: (path == `aftereventreport`) ? model_id : null,
      cyclone_outlook_id: (path == `cycloneoutlook`) ? model_id : null,
      about_id: (path == `about`) ? model_id : null,
      cyclogenesis_checksheet_detail_id: (path == `cyclogenesischecksheetdetail`) ? model_id : null,
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
      let old = (path == `techincal_bulletin_file`) ? {techincal_bulletin_id: model_id, is_delete: false} :
      (path == `public_info_bulletin_file`) ? {public_info_bulletin_id: model_id, is_delete: false} :
      (path == `ocean_gale_storm_warn_file`) ? {ocean_gale_storm_warn_id: model_id, is_delete: false} :
      (path == `track_impact_file`) ? {track_impact_id: model_id, is_delete: false} :
      (path == `coastal_zone_file`) ? {coastal_zone_id: model_id, is_delete: false} :
      (path == `extreme_weather_file`) ? {extreme_weather_id: model_id, is_delete: false} :
      (path == `gale_warning_file`) ? {gale_warning_id: model_id, is_delete: false} :
      (path == `annualreport`) ? {annual_report_id: model_id, is_delete: false} :
      (path == `aftereventreport`) ? {after_event_report_id: model_id, is_delete: false} :
      (path == `cycloneoutlook`) ? {cyclone_outlook_id: model_id, is_delete: false} :
      (path == `about`) ? {about_id: model_id, is_delete: false} :
      (path == `cyclogenesischecksheetdetail`) ? {cyclogenesis_checksheet_detail_id: model_id, is_delete: false} :
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
  
  getMultipleFile: async function (path, model_id) {
    let old = (path == `techincal_bulletin`) ? {techincal_bulletin_id: model_id, is_delete: false} :
      (path == `public_info_bulletin`) ? {public_info_bulletin_id: model_id, is_delete: false} :
      (path == `ocean_gale_storm_warn`) ? {ocean_gale_storm_warn_id: model_id, is_delete: false} :
      (path == `track_impact`) ? {track_impact_id: model_id, is_delete: false} :
      (path == `coastal_zone`) ? {coastal_zone_id: model_id, is_delete: false} :
      (path == `extreme_weather`) ? {extreme_weather_id: model_id, is_delete: false} :
      (path == `gale_warning`) ? {gale_warning_id: model_id, is_delete: false} :
      (path == `annualreport`) ? {annual_report_id: model_id, is_delete: false} :
      (path == `aftereventreport`) ? {after_event_report_id: model_id, is_delete: false} :
      (path == `cycloneoutlook`) ? {cyclone_outlook_id: model_id, is_delete: false} :
      (path == `about`) ? {about_id: model_id, is_delete: false} :
      (path == `cyclogenesischecksheetdetail`) ? {cyclogenesis_checksheet_detail_id: model_id, is_delete: false} :
      (path == `cyclogenesischecksheet`) ? {cyclogenesis_checksheet_id: model_id, is_delete: false} :
      (path == `cyclonecitra`) ? {cyclone_citra_id: model_id, is_delete: false} :
      (path == `cyclonename`) ? {cyclone_name_id: model_id, is_delete: false} :
      (path == `cyclonedescription`) ? {cyclone_description_id: model_id, is_delete: false} :
      (path == `cyclonecurrent`) ? {cyclone_current_id: model_id, is_delete: false} :
      (path == `markdown`) ? {_id: model_id, is_delete: false} :
      (path == `publication`) ? {publication_id: model_id, is_delete: false} : 
      (path == `tropicalcyclone`) ? {
        $or: [
          {techincal_bulletin_id: model_id, is_delete: false},
          {public_info_bulletin_id: model_id, is_delete: false},
          {ocean_gale_storm_warn_id: model_id, is_delete: false},
          {track_impact_id: model_id, is_delete: false},
          {coastal_zone_id: model_id, is_delete: false},
          {extreme_weather_id: model_id, is_delete: false},
          {gale_warning_id: model_id, is_delete: false},
          {tropical_cyclone_id: model_id, is_delete: false},
        ]
      } : null;

    if (old) {
      let [err, find] = await flatry( Model.find( old, `name type path` ));
      if (err) {
        return response.back(400, {}, `Error when create file upload`);
      }
      let data = [];
      if (find.length > 0) {
        for (let i = 0; i < find.length; i++) {
          let temp = find[i];
          data.push({
            file_name: temp.name,
            file_path: temp.path,
            file_type: temp.type,
            attribute: temp.path.split("/")[2],
          })
        }
      }

      return response.back(200, data, `success get file`);
    } else {
      return response.back(400, {}, `Error when create file upload, body is null`);
    }
  },

  getFile: async function (path, model_id) {
    let old = (path == `techincal_bulletin`) ? {techincal_bulletin_id: model_id, is_delete: false} :
      (path == `public_info_bulletin`) ? {public_info_bulletin_id: model_id, is_delete: false} :
      (path == `ocean_gale_storm_warn`) ? {ocean_gale_storm_warn_id: model_id, is_delete: false} :
      (path == `track_impact`) ? {track_impact_id: model_id, is_delete: false} :
      (path == `coastal_zone`) ? {coastal_zone_id: model_id, is_delete: false} :
      (path == `extreme_weather`) ? {extreme_weather_id: model_id, is_delete: false} :
      (path == `gale_warning`) ? {gale_warning_id: model_id, is_delete: false} :
      (path == `annualreport`) ? {annual_report_id: model_id, is_delete: false} :
      (path == `aftereventreport`) ? {after_event_report_id: model_id, is_delete: false} :
      (path == `cycloneoutlook`) ? {cyclone_outlook_id: model_id, is_delete: false} :
      (path == `about`) ? {about_id: model_id, is_delete: false} :
      (path == `cyclogenesischecksheetdetail`) ? {cyclogenesis_checksheet_detail_id: model_id, is_delete: false} :
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
    let old = (path == `techincal_bulletin`) ? {techincal_bulletin_id: model_id, is_delete: false} :
      (path == `public_info_bulletin`) ? {public_info_bulletin_id: model_id, is_delete: false} :
      (path == `ocean_gale_storm_warn`) ? {ocean_gale_storm_warn_id: model_id, is_delete: false} :
      (path == `track_impact`) ? {track_impact_id: model_id, is_delete: false} :
      (path == `coastal_zone`) ? {coastal_zone_id: model_id, is_delete: false} :
      (path == `extreme_weather`) ? {extreme_weather_id: model_id, is_delete: false} :
      (path == `gale_warning`) ? {gale_warning_id: model_id, is_delete: false} :
      (path == `annualreport`) ? {annual_report_id: model_id, is_delete: false} :
      (path == `aftereventreport`) ? {after_event_report_id: model_id, is_delete: false} :
      (path == `cycloneoutlook`) ? {cyclone_outlook_id: model_id, is_delete: false} :
      (path == `about`) ? {about_id: model_id, is_delete: false} :
      (path == `cyclogenesischecksheetdetail`) ? {cyclogenesis_checksheet_detail_id: model_id, is_delete: false} :
      (path == `cyclogenesischecksheet`) ? {cyclogenesis_checksheet_id: model_id, is_delete: false} :
      (path == `cyclonecitra`) ? {cyclone_citra_id: model_id, is_delete: false} :
      (path == `publication`) ? {publication_id: model_id, is_delete: false} : 
      (path == `tropicalcyclone`) ? {
        $or: [
          {techincal_bulletin_id: model_id, is_delete: false},
          {public_info_bulletin_id: model_id, is_delete: false},
          {ocean_gale_storm_warn_id: model_id, is_delete: false},
          {track_impact_id: model_id, is_delete: false},
          {coastal_zone_id: model_id, is_delete: false},
          {extreme_weather_id: model_id, is_delete: false},
          {gale_warning_id: model_id, is_delete: false},
        ]
      } : null;

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

