require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Enrollment = require('../models/Enrollment');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const docs = await Enrollment.find({ completed: true, certificateId: null });
  console.log(`Found ${docs.length} completed enrollments without a certificate ID`);

  let updated = 0;
  for (const e of docs) {
    const certId = 'CERT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    await Enrollment.findByIdAndUpdate(e._id, { $set: { certificateId: certId } });
    console.log(`  Updated ${e._id} -> ${certId}`);
    updated++;
  }

  console.log(`\nDone. ${updated} certificate IDs generated.`);
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
