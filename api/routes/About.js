const router = express.Router(),
About = require('../controllers/AboutController');

router.get('/', About.getAllData);
router.get('/:id', About.getData);
router.post('/', About.createData);
router.post('/:id', About.updateData);
router.delete('/:id', About.deleteData);

module.exports = router;
