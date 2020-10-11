const router = express.Router(),
User = require('../controllers/UserController');

router.get('/', User.getAllData);
router.get('/:id', User.getData);
router.post('/', User.createData);
router.post('/:id', User.updateData);
router.delete('/:id', User.deleteData);

module.exports = router;
