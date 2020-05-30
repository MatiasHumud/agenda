const mongoose, { Schema } = require('mongoose');

// define schema
var ContractSchema = new Schema(
	{
    title: {
      type: String,
      default: 'default',
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Beneficiary',
      required: 'Beneficiary is required',
    },
    recurso: {
      type: Schema.Types.ObjectId,
      ref: 'Benefactor',
      required: 'Benefactor is required',
    },
  },
  { timestamps: true },
);

var Contract = mongoose.model('Contract', ContractSchema);

module.exports = {
  Contract,
};
