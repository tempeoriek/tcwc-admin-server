const router = express.Router(),
Aftereventreport = require('../controllers/AftereventreportController');

router.get('/get_tropical', Aftereventreport.getTropicalCylone);

router.get('/', Aftereventreport.getAllData);
router.get('/:id', Aftereventreport.getData);
router.post('/', Aftereventreport.createData);
router.post('/:id', Aftereventreport.updateData);
router.delete('/:id', Aftereventreport.deleteData);

module.exports = router;
