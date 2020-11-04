let Schema = mongoose.Schema;

let cyclone_outlook_schema = new Schema({
  en_paragraph: {
    type: String,
    default: null,
    required: true
  },
  id_paragraph: {
    type: String,
    default: false,
    required: true
  },
  is_posted: {
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
    default: null
  },
  is_delete: {
    type: Boolean,
    default: false
  }
});

let cyclone_outlook = mongoose.model("cyclone_outlook", cyclone_outlook_schema);

module.exports = cyclone_outlook;
