const express = require('express');
const Project = require('../data/helpers/projectModel');

const router = express.Router();

router.get('/', (req, res) => {
    Project.get()
        .then(projects => {
            res.status(200).json(projects);
        })
        .catch(err => res.status(500).json({ error: 'could not get projects' }));
});

router.get('/:id', checkID, (req, res) => {
    res.status(200).json(req.project);
});

router.post('/', checkData, (req, res) => {
    
    const body = req.body;

    Project.insert(body)
        .then(add => {
            res.status(201).json(add);
        })
        .catch(err => res.status(500).json({ error: 'could not add project' }));
});

router.put('/:id', checkID, checkData, (req, res) => {

    const { id } = req.params;
    const body = req.body;

    Project.update(id, body)
        .then(updated => {
            res.status(200).json(updated);
        })
        .catch(err => res.status(500).json({ error: 'could not update project' }));
});

router.delete('/:id', checkID, (req, res) => {

    const { id } = req.params;

    Project.remove(id)
        .then(deleted => {
            res.status(200).json(deleted);
        })
        .catch(err => res.status(500).json({ error: 'could not remove project' }));
});

router.get('/:id/actions', checkID, (req, res) => {

    const { id } = req.params;

    Project.getProjectActions(id)
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(err => res.status(500).json({ error: 'could not get project actions' }));
});


// middleware
function checkID(req, res, next) {
    
    const { id } = req.params;

    Project.get(id)
        .then(checked => {
            if (checked) {
                req.project = checked;
                next();
            }
            else {
                res.status(404).json({ message: 'invalid id' })
            }
        })
        .catch(err => res.status(500).json({ message: 'server error' }));
};

function checkData(req, res, next) {
    
    const body = req.body;

    if (Object.keys(body).length === 0) {
        res.status(400).json({ message: 'missing project information' });
    }
    else if (!body.name || body.name === {}) {
        res.status(400).json({ message: 'missing required name field' });
    }
    else if (!body.description || body.description === {}) {
        res.status(400).json({ message: 'missing required description field' })
    }
    else {
        next();
    }
};


module.exports = router;
