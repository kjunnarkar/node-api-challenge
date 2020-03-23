const express = require('express');
const Action = require('../data/helpers/actionModel');
const Project = require('../data/helpers/projectModel');

const router = express.Router();

router.get('/', (req, res) => {
    
    Action.get()
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(err => res.status(500).json({ error: 'could not get actions' }));
});

router.get('/:id', checkActionID, (req, res) => {
    
    res.status(200).json(req.action);
});

router.post('/:id', checkProjectID, checkData, (req, res) => {
    
    const { id } = req.params;
    const body = req.body;
    body.project_id = id;

    Action.insert(body)
        .then(add => {
            res.status(201).json(add);
        })
        .catch(err => res.status(500).json({ error: 'could not add action' }));
});

router.put('/:id', checkActionID, checkData, (req, res) => {

    const { id } = req.params;
    const body = req.body;

    Action.update(id, body)
        .then(updated => {
            res.status(200).json(updated);
        })
        .catch(err => res.status(500).json({ error: 'could not update action' }));
});

router.delete('/:id', checkActionID, (req, res) => {

    const { id } = req.params;

    Action.remove(id)
        .then(deleted => {
                res.status(200).json(deleted);
        })
        .catch(err => res.status(500).json({ error: 'could not remove action' }));
});


// middleware
function checkActionID(req, res, next) {
    
    const { id } = req.params;

    Action.get(id)
        .then(checked => {
            if (checked) {
                req.action = checked;
                next();
            }
            else {
                res.status(404).json({ message: 'invalid id' });
            }
        })
        .catch(err => res.status(500).json({ message: 'server error' }));
};

function checkProjectID(req, res, next) {
    
    const { id } = req.params;

    Project.get(id)
        .then(checked => {
            if (checked) {
                req.project = checked;
                next();
            }
            else {
                res.status(404).json({ message: 'invalid id' });
            }
        })
        .catch(err => res.status(500).json({ message: 'server error' }));
};

function checkData(req, res, next) {
    
    const body = req.body;

    if (Object.keys(body).length === 0) {
        res.status(400).json({ message: 'missing action information' });
    }
    else if (!body.notes || body.notes === {}) {
        res.status(400).json({ message: 'missing required notes field' });
    }
    else if (!body.description || body.description === {}) {
        res.status(400).json({ message: 'missing required description field' });
    }
    else {
        next();
    }
};


module.exports = router;
