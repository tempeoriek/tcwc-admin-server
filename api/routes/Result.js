const router = express.Router(),
Result = require('../controllers/ResultController');

router.get('/', Result.getAllData);
router.get('/:id', Result.getData);
router.post('/', Result.createData);
router.post('/:id', Result.updateData);
router.delete('/:id', Result.deleteData);

module.exports = router;
