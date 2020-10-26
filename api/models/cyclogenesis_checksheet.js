let Schema = mongoose.Schema,
  Float = require('mongoose-float').loadType(mongoose);

let cyclogenesis_checksheet_schema = new Schema({
  cyclogenesis_checksheet_date_id: {
    type: Schema.Types.ObjectId,
    ref: `cyclogenesis_checksheet_date`, 
    default: null
  },
  kode_bibit : {
    type: String,
    default: null
  },
  datetime: {
    type: Date,
    default: Date.now
  },
  latitude: {
    type: String,
    default: null,
    required: true
  },
  longitude: {
    type: String,
    default: null,
    required: true
  },
  latitude_dd: {
    type: Float,
    default: null,
    required: true
  },
  longitude_dd: {
    type: Float,
    default: null,
    required: true
  },
  
  //SUSPECT AREA
  suspect_area_1: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  },
  suspect_area_2: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  suspect_area_3: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  location_suspect_area: {
    type: String,
    default: null
  }, 

  //BEC
  bec_current_a: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  bec_current_b: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  bec_current_c: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  bec_current_d: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  bec_current_e: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  bec_current_f: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  bec_current_g: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  bec_current_h: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  bec_current_i: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  bec_current_j: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  bec_trend_k: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  bec_trend_l: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  bec_trend_m: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  bec_trend_n: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  bec_trend_o: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  bec_trend_p: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 

  //DEVELOPMENT CIRCULATION
  development_circulation_1: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  development_circulation_2: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  development_circulation_3: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  development_circulation_4: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  development_circulation_5: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 

  //DDC
  ddc_6: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  ddc_7: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 
  ddc_8: {
    type: Schema.Types.ObjectId,
    ref: `date_form`, 
    default: null
  }, 

  result: {
    type: String,
    default: false
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
