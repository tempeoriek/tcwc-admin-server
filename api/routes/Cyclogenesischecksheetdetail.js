const router = express.Router(),
Cyclogenesischecksheetdetail = require('../controllers/CyclogenesischecksheetdetailController');

router.get('/', Cyclogenesischecksheetdetail.getAllData);
router.get('/:id', Cyclogenesischecksheetdetail.getData);
router.post('/', Cyclogenesischecksheetdetail.createData);
router.post('/:id', Cyclogenesischecksheetdetail.updateData);
router.delete('/:id', Cyclogenesischecksheetdetail.deleteData);

module.exports = router;
