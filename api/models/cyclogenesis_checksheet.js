let Schema = mongoose.Schema;

let cyclogenesis_checksheet_schema = new Schema({
  suspect_area_1: {
    type: Boolean,
    default: null
  },
  suspect_area_2: {
    type: Boolean,
    default: null
  }, 
  suspect_area_3: {
    type: Boolean,
    default: null
  }, 
  location_suspect_area: {
    type: String,
    default: null
  }, 
  bec_current_a: {
    type: Boolean,
    default: null
  }, 
  bec_current_b: {
    type: Boolean,
    default: null
  }, 
  bec_current_c: {
    type: Boolean,
    default: null
  }, 
  bec_current_d: {
    type: Boolean,
    default: null
  }, 
  bec_current_e: {
    type: Boolean,
    default: null
  }, 
  bec_current_f: {
    type: Boolean,
    default: null
  }, 
  bec_current_g: {
    type: Boolean,
    default: null
  }, 
  bec_current_h: {
    type: Boolean,
    default: null
  }, 
  bec_current_i: {
    type: Boolean,
    default: null
  }, 
  bec_current_j: {
    type: Boolean,
    default: null
  }, 
  bec_trend_k: {
    type: Boolean,
    default: null
  }, 
  bec_trend_l: {
    type: Boolean,
    default: null
  }, 
  bec_trend_m: {
    type: Boolean,
    default: null
  }, 
  bec_trend_n: {
    type: Boolean,
    default: null
  }, 
  bec_trend_o: {
    type: Boolean,
    default: null
  }, 
  bec_trend_p: {
    type: Boolean,
    default: null
  }, 
  development_circulation_1: {
    type: Boolean,
    default: null
  }, 
  development_circulation_2: {
    type: Boolean,
    default: null
  }, 
  development_circulation_3: {
    type: Boolean,
    default: null
  }, 
  development_circulation_4: {
    type: Boolean,
    default: null
  }, 
  development_circulation_5: {
    type: Boolean,
    default: null
  }, 
  ddc_6: {
    type: Boolean,
    default: null
  }, 
  ddc_7: {
    type: Boolean,
    default: null
  }, 
  ddc_8: {
    type: Boolean,
    default: null
  }, 
  result: {
    type: String,
    default: null
  },
  datetime: {
    type: Date,
    default: Date.now
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
