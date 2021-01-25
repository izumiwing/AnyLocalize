var express = require('express');
var fs = require('fs');
var router = express.Router();
var jsonUser;
var userAuth;

fs.readFile(".\\config\\users.json",'utf8',(err,data) => {
	if(err){
		throw new Error('users.json cannot be found or read.Please check your filesystem.');
	}
	jsonUser = eval('(' + data + ')');
	if(jsonUser.userlist == ''){
		console.log('[AnyLocalize] No default admin user detected.You might edit user.json manually.')
	}else{
		userAuth = {"userToekn":Buffer.from(Math.random().toString(),'base64').toString('hex'),"adminToken":Buffer.from(Math.random().toString(),'base64').toString('hex')};
		fs.writeFile(".\\config\\token.json",JSON.stringify(userAuth),(err) => {
			console.log('[AnyLocalize] User token refreshed.')
		})
	}
});

router.post('/',function(req,res,next){
	if(jsonUser[req.body.user] == undefined){
		res.end(JSON.stringify({status:"error"}));
	}else{
		if(req.body.passwd == jsonUser[req.body.user].password){
			if(jsonUser[req.body.user].isAdmin){
				res.end(JSON.stringify({token:userAuth.adminToken}))
			}else{
				res.end(JSON.stringify({token:userAuth.userToken}))
			}
		}else{
			res.end(JSON.stringify({status:"error"}));
		}
	}
});

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.end(404)
});

module.exports = router;
