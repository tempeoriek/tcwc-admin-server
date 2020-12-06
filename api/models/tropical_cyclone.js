let Schema = mongoose.Schema;

let tropical_cyclone_schema = new Schema({
  area: {
    type: String,
    default: null,
    // required: true
  },
  tc_name: {
    type: String,
    default: null,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  is_active: {
    type: Boolean,
    default: false
  },
  month: {
    type: String,
    default: null
  },
  year: {
    type: String,
    default: null,
    required: true
  },
  techincal_bulletin: {
    type: Boolean,
    default: false
  },
  public_info_bulletin: {
    type: Boolean,
    default: false
  },
  ocean_gale_storm_warn: {
    type: Boolean,
    default: false
  },
  track_impact: {
    type: Boolean,
    default: false
  },
  coastal_zone: {
    type: Boolean,
    default: false
  },
  extreme_weather: {
    type: Boolean,
    default: false
  },
  gale_warning: {
    type: Boolean,
    default: false
  },

  category: {
    type: String,
    default: null
  },
  is_current: {
    type: Boolean,
    default: false
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

let tropical_cyclone = mongoose.model("tropical_cyclone", tropical_cyclone_schema);

module.exports = tropical_cyclone;
