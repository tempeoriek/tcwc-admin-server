const router = express.Router(),
Cycloneoutlook = require('../controllers/CycloneoutlookController');

router.post('/filter', Cycloneoutlook.filterData);

router.get('/', Cycloneoutlook.getAllData);
router.get('/:id', Cycloneoutlook.getData);
router.post('/', Cycloneoutlook.createData);
router.post('/:id', Cycloneoutlook.updateData);
router.delete('/:id', Cycloneoutlook.deleteData);

module.exports = router;
