let Schema = mongoose.Schema;

let cyclone_citra_schema = new Schema({
  is_active: {
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
  },
});

let cyclone_citra = mongoose.model('cyclone_citra', cyclone_citra_schema);
module.exports = cyclone_citra;
