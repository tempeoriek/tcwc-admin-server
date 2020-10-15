let Schema = mongoose.Schema;

let cyclogenesis_checksheet_date_schema = new Schema({
  dates: {
    type: Array,
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

let cyclogenesis_checksheet_date = mongoose.model("cyclogenesis_checksheet_date", cyclogenesis_checksheet_date_schema);

module.exports = cyclogenesis_checksheet_date;
