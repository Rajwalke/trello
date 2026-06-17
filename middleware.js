const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser')
// app.use(cookieParser());

function authMiddleware(req, res, next) {
    const token = req.cookies.cookiesToken;
    if (!token) {
        res.status(403).json({
            message: "user not found! Please signIn/signUp"
        });
        return;
    }
    const decode = jwt.verify(token, 'raj@2004');
    const id = decode.id;
    req.id = id;
    next();
}

module.exports = {
    authMiddleware
}