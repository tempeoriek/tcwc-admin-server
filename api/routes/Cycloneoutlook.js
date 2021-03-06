const router = express.Router(),
Cycloneoutlook = require('../controllers/CycloneoutlookController');

router.post('/pdf', Cycloneoutlook.pdf);
router.post('/posted', Cycloneoutlook.posted);

router.get('/', Cycloneoutlook.getAllData);
router.get('/:id', Cycloneoutlook.getData);
router.post('/', Cycloneoutlook.createData);
router.post('/:id', Cycloneoutlook.updateData);
router.delete('/:id', Cycloneoutlook.deleteData);

module.exports = router;
