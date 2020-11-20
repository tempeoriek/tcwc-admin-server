let Schema = mongoose.Schema,
  Float = require('mongoose-float').loadType(mongoose, 20);

let cyclogenesis_checksheet_schema = new Schema({
  kode_bibit : {
    type: String,
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
