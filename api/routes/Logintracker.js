const router = express.Router(),
Logintracker = require('../controllers/LogintrackerController');

router.post('/', Logintracker.getData);

module.exports = router;
