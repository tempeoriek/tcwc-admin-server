let Schema = mongoose.Schema;

let annual_report_schema = new Schema({
  path: {
    type: String,
    default: null
  },
  url: {
    type: String,
    default: null
  },
  year: {
    type: String,
    default: null,
    required: true
  },
  en_title: {
    type: String,
    default: null
  },
  id_title: {
    type: String,
    default: null,
    required: true
  },
  is_posted: {
    type: Boolean,
    default: false
  },
  start_post: {
    type: Date,
    default: null
  },
  end_post: {
    type: Date,
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

let annual_report = mongoose.model("annual_report", annual_report_schema);

module.exports = annual_report;
