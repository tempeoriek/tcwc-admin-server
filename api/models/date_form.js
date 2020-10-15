let Schema = mongoose.Schema;

let date_form_schema = new Schema({
  date: {
    type: Date,
    default: null
  },
  time: {
    type: String,
    default: null
  },

  cyclogenesis_checksheet_date_id: {
    type: Schema.Types.ObjectId,
    ref: `cyclogenesis_checksheet_date`, 
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

let date_form = mongoose.model("date_form", date_form_schema);

module.exports = date_form;
