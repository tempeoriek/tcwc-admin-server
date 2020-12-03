const router = express.Router(),
Filecyclone = require('../controllers/FilecycloneController');

router.get('/', Filecyclone.getAllData);
router.get('/:id', Filecyclone.getData);
router.post('/', Filecyclone.createData);
router.post('/:id', Filecyclone.updateData);
router.delete('/:id', Filecyclone.deleteData);

module.exports = router;
