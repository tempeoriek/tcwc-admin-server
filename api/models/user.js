let Schema = mongoose.Schema;

let user_schema = new Schema({
  username: {
    type: String,
    default: null
  },
  password: {
    type: String,
    default: null
  },

  //admin setting
  is_view: {
    type: Boolean,
    default: false
  },
  is_admin: {
    type: Boolean,
    default: false
  },
  is_super_admin: {
    type: Boolean,
    default: false
  },
  attempt_login: {
    type: Number,
    default: 0
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

let user = mongoose.model("user", user_schema);

module.exports = user;
