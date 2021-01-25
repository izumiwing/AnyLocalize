var express = require('express');
var fs = require('fs');
var router = express.Router();

var leftMenuUpper = '<div class="leftMenuOpt"><router-link to="/" class="leftMenuLink" @click="openFile($event.srcElement.innerHTML,false)">';
var leftMenuLower = '</router-link></div>';

var jsonDashBoard = "";
var fileList = new Array();

var ejsModel = "";

fs.readFile(".\\config\\dashboard.json",'utf8',(err,data) => {
	if(err){
		throw new Error('dashboard.json cannot be found or read.Please check your filesystem.');
	}
	jsonDashBoard = eval('(' + data + ')');
	if(jsonDashBoard.flist == ''){
		ejsModel = '<br><div class="leftMenuWarning">No files detected! Please create a project.</div>'
	}else{
		fileList = jsonDashBoard.flist.split(',');
		fileList.forEach(function(item,index){
			ejsModel = ejsModel + leftMenuUpper + item + leftMenuLower;
		})
		console.log('[AnyLocalize] Index rendered.')
	}
});

/* GET home page. */
router.get('/', function(req, res, next) {
	if( jsonDashBoard == ""){
		res.end(205);
	}
	res.render('index', { title: 'Express',leftMenuContent : ejsModel});
});

module.exports = router;