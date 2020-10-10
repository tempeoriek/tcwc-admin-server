const router = express.Router(),
Cyclogenesischecksheet = require('../controllers/CyclogenesischecksheetController');

router.get('/fetch', Cyclogenesischecksheet.fetchRecord);

module.exports = router;
