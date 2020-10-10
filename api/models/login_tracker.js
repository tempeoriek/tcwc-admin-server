let Schema = mongoose.Schema;

let login_tracker_schema = new Schema({
  ip_address: {
    type: String,
    default: null
  },
  login_time: {
    type: Date,
    default: null
  },
  logout_time: {
    type: Date,
    default: null
  },

  /* relations */
  user_id: {
    type: Schema.Types.ObjectId,
    ref: `user`
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

let login_tracker = mongoose.model('login_tracker', login_tracker_schema);
module.exports = login_tracker;
