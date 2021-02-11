import express from 'express';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';
import { template } from './registration.js';
import { insertSignature, getSignatures } from './db.js';

dotenv.config();

const {
  PORT: port = 3000,
} = process.env;
const nationalIdPattern = '^[0-9]{6}-?[0-9]{4}$';

const app = express();
app.set('views', './views');
app.set('view engine', 'ejs');
// TODO setja upp rest af virkni!

app.get('/', async (req, res) => {
  const signatures = await getSignatures();
  res.render('form', { signatures });
});

app.post(
  '/post',

  // Þetta er bara validation, ekki sanitization
  body('name')
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt'),
  body('nationalId')
    .isLength({ min: 1 })
    .withMessage('Kennitala má ekki vera tóm'),
  body('nationalId')
    .matches(new RegExp(nationalIdPattern))
    .withMessage('Kennitala verður að vera á formi 000000-0000 eða 0000000000'),

  (req, res, next) => {
    const {
      name = '',
      nationalId = '',
      annad = '',
    } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((i) => i.msg);
      return res.send(
        `${template(name, nationalId, annad)}
        <p>Villur:</p>
        <ul>
          <li>${errorMessages.join('</li><li>')}</li>
        </ul>
      `,
      );
    }

    return next();
  },
  body('name').trim().escape(),
  body('email').normalizeEmail(),
  body('nationalId').blacklist('-'),

  (req, res) => {
    const {
      name,
      email,
      nationalId,
    } = req.body;

    return res.send(`
      <p>Skráning móttekin!</p>
      <dl>
        <dt>Nafn</dt>
        <dd>${name}</dd>
        <dt>Netfang</dt>
        <dd>${email}</dd>
        <dt>Kennitala</dt>
        <dd>${nationalId}</dd>
      </dl>
    `);
  },
);

// Verðum að setja bara *port* svo virki á heroku
app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
