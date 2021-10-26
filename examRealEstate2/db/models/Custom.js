const mongoose = require('mongoose');
TYPES = ['Apartment', 'Villa', 'House'];
const CustomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: [String], enum: TYPES, required: true },
    year: { type: Number, required: true },
    city: { type: String, required: true },
    homeImage: { type: String, required: true },
    description: { type: String, required: true },
    qty: { type: Number, required: true },
    tenants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

CustomSchema.method('tenantList', function () {
  return this.tenants.map(x => x.name).join(', ');
});
// CHANGE THE NAME
const Custom = mongoose.model('House', CustomSchema);

module.exports = Custom;
