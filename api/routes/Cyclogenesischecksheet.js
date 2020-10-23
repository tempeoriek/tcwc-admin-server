const router = express.Router(),
Cyclogenesischecksheet = require('../controllers/CyclogenesischecksheetController');

router.get('/', Cyclogenesischecksheet.getAllData);
router.get('/:id', Cyclogenesischecksheet.getData);
router.post('/', Cyclogenesischecksheet.createData);
router.post('/:id', Cyclogenesischecksheet.updateData);
router.delete('/:id', Cyclogenesischecksheet.deleteData);

module.exports = router;
