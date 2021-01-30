const router = express.Router(),
Upload = require('../controllers/UploadController');

router.get('/', Upload.get);
router.post('/', Upload.upload);
router.delete('/', Upload.deleteFileById);

module.exports = router;
