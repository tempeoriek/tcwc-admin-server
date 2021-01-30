const router = express.Router(),
Tropicalcyclone = require('../controllers/TropicalcycloneController');

router.get('/csv', Tropicalcyclone.csv);
router.get('/read', Tropicalcyclone.read);
router.get('/remove', Tropicalcyclone.remove);
router.get('/show', Tropicalcyclone.show);

router.post('/pdf', Tropicalcyclone.pdf);
router.post('/approve', Tropicalcyclone.approve);

router.get('/', Tropicalcyclone.getAllData);
router.get('/:id', Tropicalcyclone.getData);
router.post('/', Tropicalcyclone.createData);
router.post('/:id', Tropicalcyclone.updateData);
router.delete('/:id', Tropicalcyclone.deleteData);

module.exports = router;
