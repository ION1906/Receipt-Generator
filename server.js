const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' });

app.post('/send-receipt', upload.single('receipt'), async (req, res) => {
  const file = req.file;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jolaion190@gmail.com',
      pass: 'vldx mlyl lhyn etvm'
    }
  });

  const mailOptions = {
    from: 'yourgmail@gmail.com',
    to: 'jolaion190@gmail.com',
    subject: 'New Receipt',
    text: 'Here is the new receipt you requested.',
    attachments: [{
      filename: 'receipt.pdf',
      path: file.path
    }]
  };

  try {
    await transporter.sendMail(mailOptions);
    fs.unlinkSync(file.path);
    res.send({ success: true, message: 'Email sent!' });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
});

app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));
