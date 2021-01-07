const express = require('express')
const router = express.Router()
const Action = require('../models/Action');


router.get('/', async (req, res) => {
    try {
        const actions = await Action.find().sort('-time');
        res.json(actions)
    }
    catch (err) {
        res.json({ err: err })
    }
});

router.post('/', async (req, res) => {
    try {
        const action = new Action({
            userName: req.body.userName,
            petName: req.body.petName,
            petId: req.body.petId,
            action: req.body.action,
        });
        const savedAction = await action.save();
        res.json(savedAction);

    } catch (err) {
        res.json({ err: err })
    }
});

module.exports = router;