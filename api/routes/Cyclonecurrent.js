const router = express.Router(),
Cyclonecurrent = require('../controllers/CyclonecurrentController');

router.get('/get_tropical', Cyclonecurrent.getTropicalCylone);

router.get('/', Cyclonecurrent.getAllData);
router.get('/:id', Cyclonecurrent.getData);
router.post('/', Cyclonecurrent.createData);
router.post('/:id', Cyclonecurrent.updateData);
router.delete('/:id', Cyclonecurrent.deleteData);

module.exports = router;
