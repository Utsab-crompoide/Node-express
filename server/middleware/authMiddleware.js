import Jwt from 'jsonwebtoken'

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        Jwt.verify(token, 'test node', (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.redirect('/login')
            } else {
                next()
            }
        })
    } else {
        res.redirect('/login')
    }
}

const currentUser = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        Jwt.verify(token, 'test node', (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.locals.user = null
                next()
            } else {
                res.locals.user = decodedToken
                next()
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

export { currentUser, requireAuth }