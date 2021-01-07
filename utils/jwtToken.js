const jwt = require('jsonwebtoken');

const authToken = (req, res, next) => {
    const token = req.cookies.jwtPets;
    if (!token) return res.status(401).send('Access Denied');
    try {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
            } else {
                // console.log(decodedToken);
                next();
            }
        });
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

module.exports = { authToken };