const router = express.Router(),
Cyclogenesischecksheetdate = require('../controllers/CyclogenesischecksheetdateController');

router.get('/', Cyclogenesischecksheetdate.getAllData);
router.get('/:id', Cyclogenesischecksheetdate.getData);
router.post('/', Cyclogenesischecksheetdate.createData);
router.post('/:id', Cyclogenesischecksheetdate.updateData);
router.delete('/:id', Cyclogenesischecksheetdate.deleteData);

module.exports = router;
