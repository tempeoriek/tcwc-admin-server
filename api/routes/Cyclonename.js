const router = express.Router(),
Cyclonename = require('../controllers/CyclonenameController');

router.get('/', Cyclonename.getAllData);
router.get('/:id', Cyclonename.getData);
router.post('/', Cyclonename.createData);
router.post('/:id', Cyclonename.updateData);
router.delete('/:id', Cyclonename.deleteData);

module.exports = router;
