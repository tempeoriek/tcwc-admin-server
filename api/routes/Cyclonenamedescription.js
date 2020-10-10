const router = express.Router(),
Cyclonenamedescription = require('../controllers/CyclonenamedescriptionController');

router.get('/', Cyclonenamedescription.getAllData);
router.get('/:id', Cyclonenamedescription.getData);
router.post('/', Cyclonenamedescription.createData);
router.post('/:id', Cyclonenamedescription.updateData);
router.delete('/:id', Cyclonenamedescription.deleteData);

module.exports = router;
