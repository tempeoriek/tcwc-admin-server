let Schema = mongoose.Schema,
  Float = require('mongoose-float').loadType(mongoose, 20);

let cyclogenesis_checksheet_detail_schema = new Schema({
  cyclogenesis_checksheet_id: {
    type: Schema.Types.ObjectId,
    ref: `cyclogenesis_checksheet`, 
    default: null
  },
  
  latitude: {
    type: String,
    default: null
  },
  longitude: {
    type: String,
    default: null
  },
  latitude_dd: {
    type: Float,
    default: null
  },
  longitude_dd: {
    type: Float,
    default: null
  },
  date: {
    type: Date,
    default: Date.now
  },
  time: {
    type: String,
    default: null
  },
  //SUSPECT AREA
  suspect_area_1: {
    type: Boolean,
    default: false
  },
  suspect_area_2: {
    type: Boolean,
    default: false
  }, 
  suspect_area_3: {
    type: Boolean,
    default: false
  }, 
  location_suspect_area: {
    type: String,
    default: null
  }, 

  //BEC
  bec_current_a: {
    type: Boolean,
    default: false
  }, 
  bec_current_b: {
    type: Boolean,
    default: false
  }, 
  bec_current_c: {
    type: Boolean,
    default: false
  }, 
  bec_current_d: {
    type: Boolean,
    default: false
  }, 
  bec_current_e: {
    type: Boolean,
    default: false
  }, 
  bec_current_f: {
    type: Boolean,
    default: false
  }, 
  bec_current_g: {
    type: Boolean,
    default: false
  }, 
  bec_current_h: {
    type: Boolean,
    default: false
  }, 
  bec_current_i: {
    type: Boolean,
    default: false
  }, 
  bec_current_j: {
    type: Boolean,
    default: false
  }, 
  bec_trend_k: {
    type: Boolean,
    default: false
  }, 
  bec_trend_l: {
    type: Boolean,
    default: false
  }, 
  bec_trend_m: {
    type: Boolean,
    default: false
  }, 
  bec_trend_n: {
    type: Boolean,
    default: false
  }, 
  bec_trend_o: {
    type: Boolean,
    default: false
  }, 
  bec_trend_p: {
    type: Boolean,
    default: false
  }, 

  //DEVELOPMENT CIRCULATION
  development_circulation_1: {
    type: Boolean,
    default: false
  }, 
  development_circulation_2: {
    type: Boolean,
    default: false
  }, 
  development_circulation_3: {
    type: Boolean,
    default: false
  }, 
  development_circulation_4: {
    type: Boolean,
    default: false
  }, 
  development_circulation_5: {
    type: Boolean,
    default: false
  }, 

  //DDC
  ddc_6: {
    type: Boolean,
    default: false
  }, 
  ddc_7: {
    type: Boolean,
    default: false
  }, 
  ddc_8: {
    type: Boolean,
    default: false
  }, 

  //MW
  mw_9: {
    type: Boolean,
    default: false
  },
  mw_10: {
    type: Boolean,
    default: false
  }, 

  result_id: {
    type: Schema.Types.ObjectId,
    ref: `result`, 
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

let cyclogenesis_checksheet_detail = mongoose.model("cyclogenesis_checksheet_detail", cyclogenesis_checksheet_detail_schema);

module.exports = cyclogenesis_checksheet_detail;
