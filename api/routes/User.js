const router = express.Router(),
User = require('../controllers/UserController');

router.get('/fetch', User.fetchRecord);

module.exports = router;
