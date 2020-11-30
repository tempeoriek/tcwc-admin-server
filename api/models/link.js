let Schema = mongoose.Schema;

let link_schema = new Schema({
  title: {
    type: String,
    default: null
  },
  url: {
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

let link = mongoose.model("link", link_schema);

module.exports = link;
