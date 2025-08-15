const express = require('express');
const admin = require('firebase-admin');

const app = express();
app.use(express.json());

// Init Firebase Admin pakai environment variables dari Railway
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

// Endpoint reset password
app.post('/send-reset-email', async (req, res) => {
  const { email } = req.body;
  try {
    const link = await admin.auth().generatePasswordResetLink(email);
    res.json({ resetLink: link });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint verifikasi email
app.post('/send-verify-email', async (req, res) => {
  const { email } = req.body;
  try {
    const link = await admin.auth().generateEmailVerificationLink(email);
    res.json({ verifyLink: link });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
