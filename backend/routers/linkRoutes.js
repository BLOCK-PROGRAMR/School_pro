const express = require('express');
const router = express.Router();
const linkController = require('../controller/linkController');

// Routes
router.post('/', linkController.addLinkCollection);
router.get('/', linkController.getLinkCollections);
router.get('/date-range', linkController.getLinkCollectionsByDateRange);
router.get('/:id', linkController.getLinkCollectionById);
router.put('/:id', linkController.updateLinkCollection);
router.delete('/:id', linkController.deleteLinkCollection);

module.exports = router;