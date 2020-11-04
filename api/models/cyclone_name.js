let Schema = mongoose.Schema;

let cyclone_name_schema = new Schema({
  list_a: {
    type: String,
    default: null
  },
  list_b: {
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

let cyclone_name = mongoose.model("cyclone_name", cyclone_name_schema);

module.exports = cyclone_name;
