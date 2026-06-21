const express = require('express');
const {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  addRound,
  updateRound,
  deleteRound,
  addContact,
  deleteContact,
  addDocument,
  deleteDocument,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(getApplications).post(createApplication);

router
  .route('/:id')
  .get(getApplication)
  .put(updateApplication)
  .delete(deleteApplication);

router.route('/:id/rounds').post(addRound);
router.route('/:id/rounds/:roundId').put(updateRound).delete(deleteRound);

router.route('/:id/contacts').post(addContact);
router.route('/:id/contacts/:contactId').delete(deleteContact);

router.route('/:id/documents').post(addDocument);
router.route('/:id/documents/:documentId').delete(deleteDocument);

module.exports = router;
