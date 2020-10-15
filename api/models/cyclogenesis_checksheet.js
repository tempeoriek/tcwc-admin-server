let Schema = mongoose.Schema,
  Float = require('mongoose-float').loadType(mongoose);

let cyclogenesis_checksheet_schema = new Schema({
  date_form_id: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  },
  kode_bitit : {
    type: String,
    default: null
  },
  datetime: {
    type: Date,
    default: Date.now
  },
  latitude: {
    type: Float,
    default: null,
    required: true
  },
  longitude: {
    type: Float,
    default: null,
    required: true
  },
  
  //SUSPECT AREA
  suspect_area_1: {
    type: String,
    default: null
  },
  suspect_area_2: {
    type: String,
    default: null
  }, 
  suspect_area_3: {
    type: String,
    default: null
  }, 
  location_suspect_area: {
    type: String,
    default: null
  }, 

  //BEC
  bec_current_a: {
    type: String,
    default: null
  }, 
  bec_current_b: {
    type: String,
    default: null
  }, 
  bec_current_c: {
    type: String,
    default: null
  }, 
  bec_current_d: {
    type: String,
    default: null
  }, 
  bec_current_e: {
    type: String,
    default: null
  }, 
  bec_current_f: {
    type: String,
    default: null
  }, 
  bec_current_g: {
    type: String,
    default: null
  }, 
  bec_current_h: {
    type: String,
    default: null
  }, 
  bec_current_i: {
    type: String,
    default: null
  }, 
  bec_current_j: {
    type: String,
    default: null
  }, 
  bec_trend_k: {
    type: String,
    default: null
  }, 
  bec_trend_l: {
    type: String,
    default: null
  }, 
  bec_trend_m: {
    type: String,
    default: null
  }, 
  bec_trend_n: {
    type: String,
    default: null
  }, 
  bec_trend_o: {
    type: String,
    default: null
  }, 
  bec_trend_p: {
    type: String,
    default: null
  }, 

  //DEVELOPMENT CIRCULATION
  development_circulation_1: {
    type: String,
    default: null
  }, 
  development_circulation_2: {
    type: String,
    default: null
  }, 
  development_circulation_3: {
    type: String,
    default: null
  }, 
  development_circulation_4: {
    type: String,
    default: null
  }, 
  development_circulation_5: {
    type: String,
    default: null
  }, 

  //DDC
  ddc_6: {
    type: String,
    default: null
  }, 
  ddc_7: {
    type: String,
    default: null
  }, 
  ddc_8: {
    type: String,
    default: null
  }, 

  result: {
    type: String,
    default: null
  },

  /* config */
  created_at: {
    type: Date,
    default: Date.now
  },
  modified_at: {
    type: Date,
    default: null
  },
  is_delete: {
    type: Boolean,
    default: false
  }
});

let cyclogenesis_checksheet = mongoose.model("cyclogenesis_checksheet", cyclogenesis_checksheet_schema);

module.exports = cyclogenesis_checksheet;
