let Schema = mongoose.Schema;

let cyclone_description_schema = new Schema({
  description: {
    type: String,
    default: null
  },
  description_en: {
    type: String,
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

let cyclone_description = mongoose.model("cyclone_description", cyclone_description_schema);

module.exports = cyclone_description;
