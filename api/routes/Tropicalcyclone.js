const router = express.Router(),
Tropicalcyclone = require('../controllers/TropicalcycloneController');

router.get('/read', Tropicalcyclone.read);
router.post('/approve', Tropicalcyclone.approve);
router.get('/remove', Tropicalcyclone.remove);

router.get('/', Tropicalcyclone.getAllData);
router.get('/:id', Tropicalcyclone.getData);
router.post('/', Tropicalcyclone.createData);
router.post('/:id', Tropicalcyclone.updateData);
router.delete('/:id', Tropicalcyclone.deleteData);

module.exports = router;
