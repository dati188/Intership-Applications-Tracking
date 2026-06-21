const Application = require('../models/Application');

// GET /api/applications
// Supports query params: status, archived, search, sort, tag
const getApplications = async (req, res, next) => {
  try {
    const { status, archived, search, sort, tag } = req.query;

    const filter = { user: req.user._id };

    if (status) filter.status = status;
    if (tag) filter.tags = tag.toLowerCase();

    if (archived === 'true') {
      filter.archived = true;
    } else if (archived !== 'all') {
      filter.archived = false;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ company: regex }, { role: regex }, { location: regex }];
    }

    let sortOption = { updatedAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'company') sortOption = { company: 1 };
    if (sort === 'deadline') sortOption = { deadline: 1 };

    const applications = await Application.find(filter).sort(sortOption);
    res.status(200).json({ count: applications.length, applications });
  } catch (err) {
    next(err);
  }
};

// GET /api/applications/:id
const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ application });
  } catch (err) {
    next(err);
  }
};

// POST /api/applications
const createApplication = async (req, res, next) => {
  try {
    const { company, role } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: 'Company and role are required' });
    }

    const application = await Application.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({ application });
  } catch (err) {
    next(err);
  }
};

// PUT /api/applications/:id
const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ application });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/applications/:id
const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Application deleted', id: req.params.id });
  } catch (err) {
    next(err);
  }
};

// --- Sub-resources: rounds, contacts, documents ---

const findOwnedApplication = async (id, userId) => {
  return Application.findOne({ _id: id, user: userId });
};

// POST /api/applications/:id/rounds
const addRound = async (req, res, next) => {
  try {
    const application = await findOwnedApplication(req.params.id, req.user._id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.rounds.push(req.body);
    await application.save();
    res.status(201).json({ application });
  } catch (err) {
    next(err);
  }
};

// PUT /api/applications/:id/rounds/:roundId
const updateRound = async (req, res, next) => {
  try {
    const application = await findOwnedApplication(req.params.id, req.user._id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const round = application.rounds.id(req.params.roundId);
    if (!round) return res.status(404).json({ message: 'Interview round not found' });

    Object.assign(round, req.body);
    await application.save();
    res.status(200).json({ application });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/applications/:id/rounds/:roundId
const deleteRound = async (req, res, next) => {
  try {
    const application = await findOwnedApplication(req.params.id, req.user._id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.rounds.pull({ _id: req.params.roundId });
    await application.save();
    res.status(200).json({ application });
  } catch (err) {
    next(err);
  }
};

// POST /api/applications/:id/contacts
const addContact = async (req, res, next) => {
  try {
    const application = await findOwnedApplication(req.params.id, req.user._id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.contacts.push(req.body);
    await application.save();
    res.status(201).json({ application });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/applications/:id/contacts/:contactId
const deleteContact = async (req, res, next) => {
  try {
    const application = await findOwnedApplication(req.params.id, req.user._id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.contacts.pull({ _id: req.params.contactId });
    await application.save();
    res.status(200).json({ application });
  } catch (err) {
    next(err);
  }
};

// POST /api/applications/:id/documents
const addDocument = async (req, res, next) => {
  try {
    const application = await findOwnedApplication(req.params.id, req.user._id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.documents.push(req.body);
    await application.save();
    res.status(201).json({ application });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/applications/:id/documents/:documentId
const deleteDocument = async (req, res, next) => {
  try {
    const application = await findOwnedApplication(req.params.id, req.user._id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.documents.pull({ _id: req.params.documentId });
    await application.save();
    res.status(200).json({ application });
  } catch (err) {
    next(err);
  }
};

module.exports = {
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
};
