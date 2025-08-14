// const express = require('express');
// const multer = require('multer');
// const nodemailer = require('nodemailer');
// const cors = require('cors');
// const fs = require('fs');
 
// const app = express();
// app.use(cors());
// const upload = multer({ dest: 'uploads/' });

// app.post('/send-receipt', upload.single('receipt'), async (req, res) => {
//   const file = req.file;

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'lamadisoneventcentre@gmail.com',
//       pass: 'jhkz iqmx rpuo hoym'
//     }
//   });

//   const mailOptions = {
//     from: 'yourgmail@gmail.com',
//     to: 'lamadisoneventcentre@gmail.com',
//     subject: 'New Receipt',
//     text: 'Here is the new receipt you requested.',
//     attachments: [{
//       filename: 'receipt.pdf',
//       path: file.path
//     }]
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     fs.unlinkSync(file.path);
//     res.send({ success: true, message: 'Email sent!' });
//   } catch (error) {
//     res.status(500).send({ success: false, error });
//   }
// });

// app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));



const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/send-receipt', upload.single('receipt'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'lamadisoneventcentre@gmail.com',
      subject: 'New Receipt',
      text: 'Here is the new receipt you requested.',
      attachments: [{
        filename: file.originalname || 'receipt.pdf',
        path: file.path
      }]
    };

    await transporter.sendMail(mailOptions);

    // Remove the uploaded file after sending
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
});

app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));
