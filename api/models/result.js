let Schema = mongoose.Schema;

let result_schema = new Schema({
  result: {
    type: String,
    default: null
  },
  suggestion: {
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

let result = mongoose.model("result", result_schema);

module.exports = result;
