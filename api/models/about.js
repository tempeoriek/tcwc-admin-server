let Schema = mongoose.Schema;

let about_schema = new Schema({
  en_title: {
    type: String,
    default: null
  },
  en_paragraph: {
    type: String,
    default: null
  },
  id_title: {
    type: String,
    default: null
  },
  id_paragraph: {
    type: String,
    default: false
  },
  is_posted: {
    type: Boolean,
    default: false
  },
  start_post: {
    type: Date,
    default: null
  },
  end_post: {
    type: Date,
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

let about = mongoose.model("about", about_schema);

module.exports = about;
