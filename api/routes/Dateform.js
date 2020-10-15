const router = express.Router(),
Dateform = require('../controllers/DateformController');

router.get('/', Dateform.getAllData);
router.get('/:id', Dateform.getData);
router.post('/', Dateform.createData);
router.post('/:id', Dateform.updateData);
router.delete('/:id', Dateform.deleteData);

module.exports = router;
