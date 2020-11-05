let Schema = mongoose.Schema;

let file_upload_schema = new Schema({
  name: {
    type: String,
    default: null
  },
  path: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: false
  },
  size: {
    type: Number,
    default: false
  },

  /* relations */
  tropical_cyclone_id: {
    type: Schema.Types.ObjectId,
    ref: `tropical_cyclone`,
    default: null

  },
  annual_report_id: {
    type: Schema.Types.ObjectId,
    ref: `annual_report`,
    default: null

  },
  after_event_report_id: {
    type: Schema.Types.ObjectId,
    ref: `after_event_report`,
    default: null

  },
  cyclone_outlook_id: {
    type: Schema.Types.ObjectId,
    ref: `cyclone_outlook`,
    default: null

  },
  about_id: {
    type: Schema.Types.ObjectId,
    ref: `about`,
    default: null

  },
  cyclogenesis_checksheet_id: {
    type: Schema.Types.ObjectId,
    ref: `cyclogenesis_checksheet`,
    default: null

  },
  cyclone_citra_id: {
    type: Schema.Types.ObjectId,
    ref: `cyclone_citra`,
    default: null

  },
  publication_id: {
    type: Schema.Types.ObjectId,
    ref: `publication`,
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

let file_upload = mongoose.model("file_upload", file_upload_schema);

module.exports = file_upload;
