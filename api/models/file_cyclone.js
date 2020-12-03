let Schema = mongoose.Schema;

let arr_file_schema = new Schema({
  file: {
    type: String,
    default: null
  },
  rename: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: null
  }
});

let file_cyclone_schema = new Schema({
  name: {
    type: String,
    default: null
  },
  arr_file: [ arr_file_schema ],
  
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

let file_cyclone = mongoose.model("file_cyclone", file_cyclone_schema);

module.exports = file_cyclone;
