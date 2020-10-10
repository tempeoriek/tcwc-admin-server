let Schema = mongoose.Schema;

let publication_schema = new Schema({
  name: {
    type: String,
    default: null
  },
  year: {
    type: Date,
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
