const router = express.Router(),
Logintracker = require('../controllers/LogintrackerController');

router.get('/', Logintracker.getData);

module.exports = router;
