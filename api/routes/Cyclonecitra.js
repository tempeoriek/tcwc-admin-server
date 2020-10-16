const router = express.Router(),
Cyclonecitra = require('../controllers/CyclonecitraController');

router.get('/', Cyclonecitra.getAllData);
router.get('/:id', Cyclonecitra.getData);
router.post('/', Cyclonecitra.createData);
router.post('/:id', Cyclonecitra.updateData);
router.delete('/:id', Cyclonecitra.deleteData);

module.exports = router;
