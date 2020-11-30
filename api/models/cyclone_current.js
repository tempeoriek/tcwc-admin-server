let Schema = mongoose.Schema,
Float = require('mongoose-float').loadType(mongoose, 20);

let cyclone_current_schema = new Schema({
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
  wind_speed: {
    type: Float,
    default: null
  },
  max_wind_speed: {
    type: Float,
    default: null,
    required: true
  },
  pressure: {
    type: Float,
    default: null,
    // required: true
  },
  datetime: {
    type: Date,
    default: null,
    // required: true
  },

  /* relations */
  tropical_cyclone_id: {
    type: Schema.Types.ObjectId,
    ref: `tropical_cyclone`, 
    default: null
  },

  /* config */
  created_at: {
    type: Date,
    default: Date.now
  },
  modified_at: {
    type: Date,
    default: Date.now
  },
  is_delete: {
    type: Boolean,
    default: false
  }
});

let cyclone_current = mongoose.model("cyclone_current", cyclone_current_schema);

module.exports = cyclone_current;
