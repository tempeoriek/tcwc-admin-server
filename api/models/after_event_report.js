let Schema = mongoose.Schema;

let after_event_report_schema = new Schema({
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
  en_paragraph: {
    type: String,
    default: null
  },
  id_title: {
    type: String,
    default: null
  },
  id_paragraph: {
    type: String,
    default: false
  },
  is_posted: {
    type: Boolean,
    default: false
  },

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
    default: null
  },
  is_delete: {
    type: Boolean,
    default: false
  }
});

let after_event_report = mongoose.model("after_event_report", after_event_report_schema);

module.exports = after_event_report;
