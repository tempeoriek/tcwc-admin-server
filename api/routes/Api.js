const router = express.Router(),
Api = require('../controllers/ApiController');

router.post('/child', Api.child);
router.post('/filter', Api.filter);
router.get('/last', Api.last);


module.exports = router;
