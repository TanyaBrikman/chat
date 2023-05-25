module.exports = function (app, passport) {

    app.get('/', ((req, res) => {
        const title = 'Home'
        res.render('index')
    }))

    app.get('/login', ((req, res) => {
        const title = 'Login'
        res.render('loginUser', {message: req.flash('message')})
    }))

    app.post('/login', passport.authenticate('login', {
        successRedirect: '/chat-program',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/signup', function (req, res) {
        const title = 'Signup'
        res.render('register', {message: req.flash('message')})
    });

    app.post('/signup', passport.authenticate('signup', {
        successRedirect: '/chat-program',
        failureRedirect: '/signup',
        failureMessage: true,
        failureFlash: true
    }));

    app.get('/chat-program', (req, res) => {
        const title = 'Chat'
        res.render('chat-program')
    })

    app.get('/chat-program', isLoggedIn, function (req, res) {
        res.render('chat-program', {user: req.user});
    });

    function isLoggedIn(req, res, next) {

        console.log(">> isLoggedIn")

        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }
}