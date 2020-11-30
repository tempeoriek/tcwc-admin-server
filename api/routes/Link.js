const router = express.Router(),
Link = require('../controllers/LinkController');

router.get('/', Link.getAllData);
router.get('/:id', Link.getData);
router.post('/', Link.createData);
router.post('/:id', Link.updateData);
router.delete('/:id', Link.deleteData);

module.exports = router;
