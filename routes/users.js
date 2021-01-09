const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Pet = require("../models/Pet");
const { userSignup, userLogin } = require("../utils/auth");
//const { authToken } = require("../utils/jwtToken");

// TOKEN MIDDLEWARE REMOVED


// create json web token
const maxAge = 1 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
        expiresIn: maxAge,
    });
};

router.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.json({ err: err });
    }
});

router.post("/signup", async (req, res) => {
    console.log(req.body);
    const { error, value } = userSignup(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send("Email already exists");

    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(req.body.password, salt);

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        password: hash,
    });

    try {
        const savedUser = await user.save();
        const token = createToken(savedUser._id);
        res.cookie("jwtPets", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.json(savedUser._id);
    } catch (err) {
        res.json({ err: err });
    }
});

router.post("/login", async (req, res) => {
    console.log(req.body);
    try {
        const { error, value } = userLogin(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("Email is wrong");
        const rightPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!rightPassword) return res.status(400).send("Invalid Password");

        const token = createToken(user._id);
        res.cookie("jwtPets", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.json(user._id);
    } catch (err) {
        res.json({ err: err });
    }
});

router.get("/logout", (req, res) => {
    try {
        res.cookie('jwtPets', '', { maxAge: 1 });
        send('done')
    } catch (err) {
        res.json({ err: err });
    }
});

router.get("/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json(user);
    } catch (err) {
        res.json({ err: err });
    }
});

router.delete("/:userId", async (req, res) => {
    try {
        const removeUser = await User.remove({ _id: req.params.userId });
        res.json(removeUser);
    } catch (err) {
        res.json({ err: err });
    }
});

router.patch("/:userId", async (req, res) => {
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(req.body.password, salt);

    try {
        const update = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: hash,
            bio: req.body.bio,
        };
        const updateUser = await User.findOneAndUpdate(
            { _id: req.params.userId },
            update,
            { new: true }
        );
        res.json(updateUser);
    } catch (err) {
        res.json({ err: err });
    }
});

router.get("/:userId/saved", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json(user.savedPets);
    } catch (err) {
        res.json({ err: err });
    }
});

router.get("/:userId/adopted", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json(user.adoptPets);
    } catch (err) {
        res.json({ err: err });
    }
});

router.get("/:userId/fostered", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json(user.fosterPets);
    } catch (err) {
        res.json({ err: err });
    }
});

router.patch("/:userId/saved", async (req, res) => {
    console.log(req.body);
    const newPet = await Pet.findById(req.body.petId);
    try {
        const update = {
            $push: { savedPets: newPet._id },
        };
        const updateUser = await User.findOneAndUpdate(
            { _id: req.params.userId },
            update,
            { new: true }
        );
        res.json(updateUser);
    } catch (err) {
        res.json({ err: err });
    }
});

router.patch("/:userId/adopted", async (req, res) => {
    console.log(req.body);
    try {
        const petUpdate = {
            adoptId: req.params.userId,
            adoption: 1,
        };
        const updatePet = await Pet.findOneAndUpdate(
            { _id: req.body.petId },
            petUpdate,
            { new: true }
        );
        const update = {
            $push: { adoptPets: updatePet._id },
        };
        const updateUser = await User.findOneAndUpdate(
            { _id: req.params.userId },
            update,
            { new: true }
        );
        res.json(updateUser);
    } catch (err) {
        res.json({ err: err });
    }
});

router.patch("/:userId/fostered", async (req, res) => {
    console.log(req.body);
    try {
        const petUpdate = {
            fosterId: req.params.userId,
            adoption: 2,
        };
        const updatePet = await Pet.findOneAndUpdate(
            { _id: req.body.petId },
            petUpdate,
            { new: true }
        );
        const update = {
            $push: { fosterPets: updatePet._id },
        };
        const updateUser = await User.findOneAndUpdate(
            { _id: req.params.userId },
            update,
            { new: true }
        );
        res.json(updateUser);
    } catch (err) {
        res.json({ err: err });
    }
});

router.delete("/:userId/saved", async (req, res) => {
    console.log(req.body);
    try {
        const pet = await Pet.findById(req.body.petId);
        const update = {
            $pull: { savedPets: pet._id },
        };
        const updateUser = await User.findOneAndUpdate(
            { _id: req.params.userId },
            update,
            { new: true }
        );
        res.json(updateUser);
    } catch (err) {
        res.json({ err: err });
    }
});

router.delete("/:userId/adopted", async (req, res) => {
    console.log(req.body);
    const pet = await Pet.findById(req.body.petId);
    try {
        const petUpdate = {
            adoptId: null,
            adoption: 3,
        };
        const updatePet = await Pet.findOneAndUpdate(
            { _id: req.body.petId },
            petUpdate,
            { new: true }
        );
        const update = {
            $pull: { adoptPets: pet._id },
        };
        const updateUser = await User.findOneAndUpdate(
            { _id: req.params.userId },
            update,
            { new: true }
        );
        res.json(updateUser);
    } catch (err) {
        res.json({ err: err });
    }
});

router.delete("/:userId/fostered", async (req, res) => {
    console.log(req.body);
    const pet = await Pet.findById(req.body.petId);
    try {
        const petUpdate = {
            fosterId: null,
            adoption: 3,
        };
        const updatePet = await Pet.findOneAndUpdate(
            { _id: req.body.petId },
            petUpdate,
            { new: true }
        );
        const update = {
            $pull: { fosterPets: pet._id },
        };
        const updateUser = await User.findOneAndUpdate(
            { _id: req.params.userId },
            update,
            { new: true }
        );
        res.json(updateUser);
    } catch (err) {
        res.json({ err: err });
    }
});
module.exports = router;
