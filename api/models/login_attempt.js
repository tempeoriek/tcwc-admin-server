let Schema = mongoose.Schema;

let login_attempt_schema = new Schema({
  attempt_login: {
    type: Number,
    default: 0
  },
  attempt_login_time: {
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

let login_attempt = mongoose.model('login_attempt', login_attempt_schema);
module.exports = login_attempt;
