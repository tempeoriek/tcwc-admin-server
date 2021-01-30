const router = express.Router(),
Annualreport = require('../controllers/AnnualreportController');

router.get('/', Annualreport.getAllData);
router.get('/csv', Annualreport.csv);
router.get('/:id', Annualreport.getData);
router.post('/', Annualreport.createData);
router.post('/:id', Annualreport.updateData);
router.delete('/:id', Annualreport.deleteData);

module.exports = router;
