let Schema = mongoose.Schema;

let cyclone_description_schema = new Schema({
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

let cyclone_description = mongoose.model("cyclone_description", cyclone_description_schema);

module.exports = cyclone_description;
