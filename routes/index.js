// app/routes/index.js

var express = require('express');
var router = express.Router();
const {requiresAuth} = require('express-openid-connect');
const axios = require('axios');

router.get('/', (req, res)=> {
    var logged = req.oidc.isAuthenticated();
    if (logged) {
        // Do something if logged is true
        console.log("User is authenticated");
        console.log("UserID: " + req.oidc.user.sub);
    } else {
        // Do something else if logged is false
        console.log("User is not authenticated");
    }
    res.render("index", { title:"¡Paddel Teams! Roque Perez", 
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user,
} )

});

router.get('/secured', requiresAuth(), async (req, res)=> {
    let data = {}

    const {token_type, access_token} = req.oidc.accessToken
    console.log(req.oidc.accessToken)


    try {
        const apiResponse = await axios.get('http://localhost:5000/private', 
        {
            headers:{
                authorization: `${token_type} ${access_token}`,
            }
        })
        data = apiResponse.data
    } catch (e) {}

    var logged = req.oidc.isAuthenticated();
    if (logged) {
        // Do something if logged is true
        console.log("User is authenticated");
        console.log("UserID: " + req.oidc.user.sub);
    } else {
        // Do something else if logged is false
        console.log("User is not authenticated");
    }

    
    res.render("secured", { title:"Solo Registrados", 
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user,
    data
} )

});

module.exports = router;