const router = express.Router(),
Annualreport = require('../controllers/AnnualreportController');

router.post('/filter', Annualreport.filterData);

router.get('/', Annualreport.getAllData);
router.get('/:id', Annualreport.getData);
router.post('/', Annualreport.createData);
router.post('/:id', Annualreport.updateData);
router.delete('/:id', Annualreport.deleteData);

module.exports = router;
