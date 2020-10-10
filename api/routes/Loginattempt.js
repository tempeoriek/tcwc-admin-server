const router = express.Router(),
Loginattempt = require('../controllers/LoginattemptController');

router.get('/fetch', Loginattempt.fetchRecord);

module.exports = router;
