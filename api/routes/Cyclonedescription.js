const router = express.Router(),
Cyclonedescription = require('../controllers/CyclonedescriptionController');

router.post('/posted', Cyclonedescription.posted);
router.get('/', Cyclonedescription.getAllData);
router.get('/:id', Cyclonedescription.getData);
router.post('/', Cyclonedescription.createData);
router.post('/:id', Cyclonedescription.updateData);
router.delete('/:id', Cyclonedescription.deleteData);

module.exports = router;
