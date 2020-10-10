const router = express.Router(),
Logintracker = require('../controllers/LogintrackerController');

router.get('/fetch', Logintracker.fetchRecord);

module.exports = router;
