module.exports = function (app, passport) {

    app.get('/', ((req, res) => {
        const title = 'Home'
        res.render('index', {title})
    }))

    app.get('/login', ((req, res) => {
        const title = 'Login'
        res.render('loginUser', {title, message: req.flash('message')})
    }))

    app.post('/login', passport.authenticate('login', {
        successRedirect: '/chat-program',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/signup', function (req, res) {
        const title = 'Signup'
        res.render('register', {title, message: req.flash('message')})
    });

    app.post('/signup', passport.authenticate('signup', {
        successRedirect: '/chat-program',
        failureRedirect: '/signup',
        failureMessage: true,
        failureFlash: true
    }));

    app.get('/chat-program', isLoggedIn, function (req, res) {
        const title = "Chat"
        res.render('chat-program', {title, user: req.user.username});
    });


    function isLoggedIn(req, res, next) {

        console.log(">> isLoggedIn")

        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }
}