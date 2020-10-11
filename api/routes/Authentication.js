const router = express.Router(),
Authentication = require('../controllers/AuthenticationController');

router.post('/login', Authentication.login);
router.post('/logout', Authentication.logout);

module.exports = router;
