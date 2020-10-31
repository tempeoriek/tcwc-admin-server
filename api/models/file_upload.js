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
    ref: `tropical_cyclone`
  },
  annual_report_id: {
    type: Schema.Types.ObjectId,
    ref: `annual_report`
  },
  after_event_report_id: {
    type: Schema.Types.ObjectId,
    ref: `after_event_report`
  },
  cyclone_outlook_id: {
    type: Schema.Types.ObjectId,
    ref: `cyclone_outlook`
  },
  about_id: {
    type: Schema.Types.ObjectId,
    ref: `about`
  },
  cyclogenesis_checksheet_id: {
    type: Schema.Types.ObjectId,
    ref: `cyclogenesis_checksheet`
  },
  cyclone_citra_id: {
    type: Schema.Types.ObjectId,
    ref: `cyclone_citra`
  },
  publication_id: {
    type: Schema.Types.ObjectId,
    ref: `publication`
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
