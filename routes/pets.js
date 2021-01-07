const express = require('express')
const router = express.Router()
const Pet = require('../models/Pet');
const User = require('../models/User');
const { cloudinary } = require('../utils/cloadinary')
const { authToken } = require("../utils/jwtToken");


router.get('/', async (req, res) => {
    try {
        const pets = await Pet.find();
        res.json(pets)
    }
    catch (err) {
        res.json({ err: err })
    }
});

router.get('/petsId', async (req, res) => {
    try {
        const pets = await Pet.find();
        let petsId = [];
        for (let i = 0; i < pets.length; i++) {
            petsId.push(pets[i]._id)
        }
        res.json(petsId)
    } catch (error) {
        res.json({ err: error })
    }
}
);


router.post('/addpet', authToken, async (req, res) => {

    try {
        let imageId = [];
        const image = req.body.images[0];
        const cloudImage = await cloudinary.uploader.upload(image, {
            upload_preset: 'petPics',
        });
        imageId.push(cloudImage.public_id);
        console.log(imageId);
        const pet = new Pet({
            name: req.body.name,
            type: req.body.type,
            breed: req.body.breed,
            color: req.body.color,
            bio: req.body.bio,
            height: req.body.height,
            weight: req.body.weight,
            hypo: req.body.hypo,
            diet: req.body.diet,
            images: imageId
        });
        console.log(pet)
        const savedPet = await pet.save();
        res.json(savedPet)
    }
    catch (err) {
        res.json({ err: err })
    }
});

router.get('/:petId', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.petId);
        res.json(pet)
    }
    catch (err) {
        res.json({ err: err })
    }
});

router.patch('/:petId', authToken, async (req, res) => {
    try {
        let imageId = [];
        const image = req.body.images[0];
        const cloudImage = await cloudinary.uploader.upload(image, {
            upload_preset: 'petPics',
        });
        imageId.push(cloudImage.public_id);
        console.log(imageId);
        const update = {
            name: req.body.name,
            type: req.body.type,
            breed: req.body.breed,
            color: req.body.color,
            bio: req.body.bio,
            height: req.body.height,
            weight: req.body.weight,
            hypo: req.body.hypo,
            diet: req.body.diet,
            images: imageId
        }
        const updatePet = await Pet.findOneAndUpdate(
            { _id: req.params.petId }, update, { new: true });
        res.json(updatePet)
    }
    catch (err) {
        res.json({ err: err })
    }
});

router.delete('/:petId', authToken, async (req, res) => {
    try {
        const removePet = await Pet.remove({ _id: req.params.petId });
        res.json(removePet)
    }
    catch (err) {
        res.json({ err: err })
    }
});

router.get('/:petId/foster', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.petId);
        const foster = pet.fosterId;
        const user = await User.findById(foster);
        res.json(user)
    }
    catch (err) {
        res.json({ err: err })
    }
});

router.get('/:petId/adopt', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.petId);
        const adopt = pet.adoptId;
        const user = await User.findById(adopt);
        res.json(user)
    }
    catch (err) {
        res.json({ err: err })
    }
});

router.post('/type', async (req, res) => {
    try {
        let replace = req.body.type;
        let typeReg = new RegExp(replace, "i");
        const pets = await Pet.find({ type: typeReg }).exec();
        let petsId = [];
        for (let i = 0; i < pets.length; i++) {
            petsId.push(pets[i]._id)
        }
        res.json(petsId)

    } catch (err) {
        res.json({ err: err })
    }
});

router.post('/status', async (req, res) => {
    try {
        const pets = await Pet.find({ adoption: req.body.status }).exec();
        let petsId = [];
        for (let i = 0; i < pets.length; i++) {
            petsId.push(pets[i]._id)
        }
        res.json(petsId)

    } catch (err) {
        res.json({ err: err })
    }
});

router.post('/size', async (req, res) => {
    try {
        const pets = await Pet.find({ height: { $lte: req.body.height }, weight: { $lte: req.body.weight } }).exec();
        let petsId = [];
        for (let i = 0; i < pets.length; i++) {
            petsId.push(pets[i]._id)
        }
        res.json(petsId)

    } catch (err) {
        res.json({ err: err })
    }
});

router.post('/name', async (req, res) => {
    try {
        let replace = req.body.name;
        let nameReg = new RegExp(replace, "i");
        const pets = await Pet.find({ name: nameReg }).exec();
        let petsId = [];
        for (let i = 0; i < pets.length; i++) {
            petsId.push(pets[i]._id)
        }
        res.json(petsId)
    } catch (err) {
        res.json({ err: err })
    }
});

module.exports = router;
