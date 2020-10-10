const router = express.Router(),
Tropicalcyclone = require('../controllers/TropicalcycloneController');

router.get('/', Tropicalcyclone.getAllData);
router.get('/:id', Tropicalcyclone.getData);
router.post('/', Tropicalcyclone.createData);
router.post('/:id', Tropicalcyclone.updateData);
router.delete('/:id', Tropicalcyclone.deleteData);

module.exports = router;
