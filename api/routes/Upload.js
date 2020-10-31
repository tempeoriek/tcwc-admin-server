const router = express.Router(),
Upload = require('../controllers/UploadController');

router.get('/', Upload.get);
router.post('/', Upload.upload);

module.exports = router;
