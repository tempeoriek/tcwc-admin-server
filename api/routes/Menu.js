const router = express.Router(),
Menu = require('../controllers/MenuController');

router.get('/', Menu.getAllData);
router.get('/:id', Menu.getData);
router.post('/', Menu.createData);
router.post('/:id', Menu.updateData);
router.delete('/:id', Menu.deleteData);

module.exports = router;
