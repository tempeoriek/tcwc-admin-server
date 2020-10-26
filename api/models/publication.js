let Schema = mongoose.Schema;

let publication_schema = new Schema({
  id_title: {
    type: String,
    default: null
  },
  en_title: {
    type: String,
    default: null
  },
  id_paragraph: {
    type: String,
    default: null
  },
  en_paragraph: {
    type: String,
    default: null
  },
  path: {
    type: String,
    default: null
  },
  url: {
    type: String,
    default: null
  },
  year: {
    type: String,
    default: null
  },
  author: {
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

let publication = mongoose.model("publication", publication_schema);

module.exports = publication;
