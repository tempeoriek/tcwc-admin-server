const router = express.Router(),
Publication = require('../controllers/PublicationController');

router.post('/filter', Publication.filterData);

router.get('/', Publication.getAllData);
router.get('/:id', Publication.getData);
router.post('/', Publication.createData);
router.post('/:id', Publication.updateData);
router.delete('/:id', Publication.deleteData);

module.exports = router;
