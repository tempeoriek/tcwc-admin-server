let Schema = mongoose.Schema;

let sub_menu_schema = new Schema({
  name: {
    type: String,
    default: null
  },
  route: {
    type: String,
    default: null
  },

  is_delete: {
    type: Boolean,
    default: false
  }
});

let menu_schema = new Schema({
  name: {
    type: String,
    default: null
  },
  route: {
    type: String,
    default: null
  },
  order: {
    type: Number,
    default: null
  },

  is_admin: {
    type: Boolean,
    default: false
  },
  is_super_admin: {
    type: Boolean,
    default: false
  },
  sub_menu: [sub_menu_schema],
  
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

let menu = mongoose.model('menu', menu_schema);
module.exports = menu;
