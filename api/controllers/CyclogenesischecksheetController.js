const Model = require('../models/cyclogenesis_checksheet'),
  UploadController = require('./UploadController'),
  ApiController = require('./ApiController'),
  file_path = `cyclogenesischecksheet`;

CyclogenesischecksheetController = {
  chunk : function (array, size) {
    if (!array.length) {
      return [];
    }
    const head = array.slice(0, size);
    const tail = array.slice(size);
  
    return [head, ...CyclogenesischecksheetController.chunk(tail, size)];
  },

  pdf: async function (req, res) {
    let { id } = req.body, data = [], upload;
    let child = await ApiController.getChildFromParent(`Cyclogenesischecksheetdetail`, id, file_path, null, `cyclogenesis_checksheet_id result_id`);
    if (child.status == 400) {
      response.error(400, child.message, res, child.message);
    }

    if (child.status == 200) {
      let template = fs.readFileSync('./files/html/checksheet/html.ejs', 'utf8');
      let today = moment.utc().format(`YYYYMMDDHHMMSS`);
      let file_loop = CyclogenesischecksheetController.chunk(child.data, 8);
      
      for (let i = 0; i < file_loop.length; i++) {
        let temp = file_loop[i];
        let html = ejs.render(template, {data: temp, result : child.data[child.data.length-1].result_id});
        let name_pdf = `${file_path}-${today}-${i}`;

        let create_pdf = await ApiController.generatePDF(html, file_path, name_pdf);
        if (create_pdf.status == 400) {
          response.error(400, `Error when create pdf`, res, create_pdf.message);
        }
        
        //CREATE PDF INTO DB
        if (create_pdf.data && file_path) {
          let str = create_pdf.data.filename;
          let n = str.indexOf(`pdf`);
          let path = str.substring(n-1, str.length)
          let obj = { name: name_pdf, path, type: `pdf`}
          upload = await UploadController.createExternalFile(obj, file_path, id, `create`)
          if (upload.status == 400) {
            response.error(400, `Error when upload data in createData cyclonecitra`, res, err);
          }
        }

        data.push(upload.data)
        // data = (upload) ? upload.data : null;
      }
      response.ok(data, res, `success create pdf`);
    }
  },

  getAllData: async function (req, res) {
    let err, find, fields = [], data = [];
    
    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers cyclonecitra`, res, checkHeaders.message);
    }

    [err, find] = await flatry( Model.find({ is_delete: false }));
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when find data in getAllData cyclogenesischecksheet`, res, err);
    }
    
    if (find.length > 0) {
      fields.push(
        { key: 'kode_bibit', label: 'Kode Bibit', sortable: true },
        { key: 'actions', label: 'Actions' }
      );

      for (let i = 0; i < find.length; i++) {
        let temp = find[i];
        data.push({
          _id: temp._id,
          kode_bibit: (temp.kode_bibit) ? temp.kode_bibit : `-`,
        })
      }
      
      response.ok(data, res, `success get all data`, fields);
    } else if (find.length == 0) {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  getData: async function (req, res) {
    let err, data, { id } = req.params, child_fields = [], childs = [];
    
    //CHECK HEADERS
    let checkHeaders = await ApiController.checkHeaders(req.headers)
    if (checkHeaders.status == 400) {
      return response.error(400, `Error when check headers cyclonecitra`, res, checkHeaders.message);
    }

    [err, data] = await flatry( Model.findOne({ is_delete: false, _id: id }) );
    if (err) {
      console.log(err.stack);
      response.error(400, `Error when findOne data in getdata cyclogenesischecksheet`, res, err);
    }

    //UPLOAD FILE
    let upload = await UploadController.getMultipleFile(file_path, id)
    if (upload.status == 400 && !upload.data) {
      response.error(400, `Error when upload data in createData tropicalcyclone`, res, err);
    }

    if (data) {
      //GET ALL CHILD
      let child = await ApiController.getChildFromParent(`Cyclogenesischecksheetdetail`, data._id, file_path, null, null);
      if (child.status == 400) {
        response.error(400, child.message, res, child.message);
      }

      for (let i = 0; i < child.data.length; i++) {
        let temp = child.data[i];
        childs.push(temp)
      }

      //UPLOAD FILE
      data = {
        content: data,
        childs,
        child_fields,
        files : (upload.data.length > 0) ? upload.data : null
      }
      response.ok(data, res, `success get all data`);
    } else {
      response.success(data, res, `success get all data but data is empty`);
    }
  },

  createData: async function (req, res) {
    if (Object.entries(req.body).length > 0) {
      let { kode_bibit } = req.body, err, data;
      let new_data = { kode_bibit };
    
      //CREATE DATA
      [err, data] = await flatry( Model.create( new_data ) );
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when create data in createData cyclogenesischecksheet`, res, err);
      }
      
      //UPLOAD FILE FOR MULTIPLE AND SINGLE UPLOAD FILE
      if (req.files && data && file_path) {
        let upload;
        upload = await UploadController.chooseUploadData(req.files, file_path, data._id, `create`)
        if (upload.status == 400) {
          response.error(400, `Error when upload data in ${file_path}`, res, err);
        }
      }

      response.ok(data, res, `success create data`);
    } else {
      response.error(400, `Data not completed`, res);
    }
  },

  updateData: async function (req, res) {
    if (Object.entries(req.body).length > 0 && Object.entries(req.params).length > 0) {
      let {  kode_bibit  } = req.body, { id } = req.params;
      let new_data = { kode_bibit }, err, data, 
      filter = { _id: id, is_delete: false };

      //UPDATE DATA
      [err, data] = await flatry( Model.findOneAndUpdate( filter, new_data, {new: true}));
      if (err) {
        console.log(err.stack);
        response.error(400, `Error when findoneandupdate data in updatedata cyclogenesischecksheet`, res, err);
      }
      
      //UPLOAD FILE
      if (req.files && data && file_path) {
        let upload;
        upload = await UploadController.chooseUploadData(req.files, file_path, data._id, `update`)
        if (upload.status == 400) {
          response.error(400, `Error when upload data in ${file_path}`, res, err);
        }
      } else {
        let upload = await UploadController.deleteFile(data._id, file_path)
        if (upload.status == 400) {
          return response.error(400, `Error when delete empty file ${file_path}`, res, err);
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
      if (err || !data) {
        console.log(err.stack);
        response.error(400, `Error when findOneAndUpdate data in deleteData cyclogenesischecksheet`, res, err);
      }

      let child = await ApiController.getChildToDelete(`Cyclogenesischecksheetdetail`, id, file_path);
      if (child.status == 400) {
        response.error(400, child.message, res, child.message);
      } 

      //UPLOAD FILE
      if (data && child.status == 200) {
        let upload = await UploadController.deleteFile(data._id, file_path)
        if (upload.status == 400) {
          response.error(400, `Error when upload data in createData tropicalcyclone`, res, err);
        }
        response.ok(data, res, `success delete data`);
      }
    } else {
      response.error(400, `Data not completed`, res);
    }
  }
};

module.exports = CyclogenesischecksheetController;