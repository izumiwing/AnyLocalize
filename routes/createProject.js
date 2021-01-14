var express = require('express');
var multer = require('multer');
var router = express.Router();
var fs = require('fs');
var readLine = require("readline");
var events = require('events');
var eventEmitter = new events.EventEmitter();


var storage = multer.diskStorage({
	destination: './config/source/',
	filename:(req,file,cb) =>{
		cb(null,file.originalname.split('.')[0] + '_any' + Date.now() + '.' + file.originalname.split('.')[1]);
	}
})

var upload = multer({ storage: storage })

router.post('/upload',upload.single('file'),function(req,res,next){
	var formObj = req.body;
	var AnyJSON_Mode = formObj.mode;
	switch(AnyJSON_Mode){
		case 'DelimiterSplit':
			var AnyJSON = {
				source:req.file.filename,
				mode:AnyJSON_Mode,
				ds_dlmt:formObj.ds_dlmt,
				ds_pp:formObj.ds_pp,
				ds_tpANS:formObj.ds_tpANS,
				ignoreChar:formObj.ignoreChar,
				localizedProgress:0
			}
			if(formObj.ds_pp == 'inner'){
				AnyJSON.ds_dlmt2 = formObj.ds_dlmt2;
			}
			AnyJSON.ds_tpANS = false;
			if(formObj.ds_tpANS == 'yes'){
				AnyJSON.ds_tpANS = true;
				AnyJSON.ds_tp = formObj.ds_tp;
			}
			AnyJSON.locposANS = false;
			if(formObj.locposANS == 'yes'){
				
				AnyJSON.locposANS = true;
				AnyJSON.startpos = formObj.startpos;
				AnyJSON.endpos = formObj.endpos;
			}
			// Verfiy Start
			eventEmitter.emit(AnyJSON_Mode,AnyJSON,formObj,AnyJSON.source);
			res.end('Submited');
		break;
		default :
			res.end('Unknown mode')
		break;
	}
})

eventEmitter.on('DelimiterSplit',function(AnyJSON,formObj,evt_Fname){
	switch(AnyJSON.ds_pp){
		case 'right':
			var arr = [];
			var arrTextConn = '';
			var readObj = readLine.createInterface({
				input: fs.createReadStream('./config/source/' + evt_Fname)
			});
			
			var counter = 1;
			var jmpFlag = false;
			readObj.on('line',function(line){
				jmpFlag = false;
				if(AnyJSON.locposANS){
					if(counter < AnyJSON.startpos || counter > AnyJSON.endpos){
						jmpFlag = true;
					}
					counter++;
				}
				if(!jmpFlag){
					if(AnyJSON.ds_tpANS && line.trim() != ''){
						var prefixAlign = false;
						var prefixPos = line.indexOf(AnyJSON.ds_tp,-1);
						if(arrTextConn != ''){
							line = arrTextConn + ' ' + line;
							arrTextConn = '';
						}
						while(prefixPos != -1){
							prefixPos = line.indexOf(AnyJSON.ds_tp,prefixPos + 1);
							if(prefixPos != -1){
								prefixAlign = !prefixAlign
							}
						}
						if(!prefixAlign){
							arrTextConn = line;
							line = '';
						}else{
							//line = line.replace(RegExp(AnyJSON.ds_tp,'g'),'');
						}
					}
					if(line.indexOf("'") != -1 && line.trim() != ''){
						
						line = line.replace(/'/g,'\\' + '\'');
						//console.log(line)
					}
					if(AnyJSON.ignoreChar != ''){
						if(line.indexOf(AnyJSON.ignoreChar) == -1){
							if(line.trim() != ''){
								arr.push(line);
							}
						}
					}else{
						if(line.trim() != ''){
							arr.push(line);
						}
					}
				}
			})
			
			readObj.on('close',function(){
				var delimiterOffset = arr[0].indexOf(AnyJSON.ds_dlmt);
				var phraseOffset = arr[0].indexOf(formObj['validatePhrase0'],delimiterOffset) - delimiterOffset;
				var counter = 1;
				//console.log(arr[0]);
				for(var i=1;i<3;i++){
					delimiterOffset = arr[i].indexOf(AnyJSON.ds_dlmt);
					console.log(arr[i]);
					if(phraseOffset == arr[i].indexOf(formObj['validatePhrase'+i].replace(/'/g,'\\' + '\''),delimiterOffset) - delimiterOffset){
						counter++;
					}
					if(counter == 3){
						console.log('Compared OK')
					}else{
						if(i == 2){
							console.log('Compared Failed')
						}
					}
				}
				if(counter == 3){
					var arrStr = 'new Array('
					var delimiterOffset;
					arr.forEach(function(item,index){
						delimiterOffset = arr[index].indexOf(AnyJSON.ds_dlmt);
						var localizeOffset = delimiterOffset + phraseOffset;
						if(AnyJSON.ds_tpANS){
							if(index != arr.length - 1){
								arrStr = arrStr + '\'' + item.substring(localizeOffset,item.indexOf(AnyJSON.ds_tp,localizeOffset)) + '\',';
							}else{
								arrStr = arrStr + '\'' + item.substring(localizeOffset,item.indexOf(AnyJSON.ds_tp,localizeOffset)) + '\')'
							}
						}else{
							if(index != arr.length - 1){
								arrStr = arrStr + '\'' + item.substring(localizeOffset,item.length) + '\',';
							}else{
								arrStr = arrStr + '\'' + item.substring(localizeOffset,item.length) + '\')'
							}
						}
					})
					var fileHeader = 'var foreignLang = ' + arrStr + "\r\n" + 'var localizedLang = ' + arrStr + "\r\n" + 'module.exports = { foreignLang,localizedLang }'
					fs.writeFile('./config/translate/'+evt_Fname.split('.')[0] + '.js',fileHeader,(err)=>{
						if(err) throw err
					})
					fs.writeFile('./config/translate/'+evt_Fname.split('.')[0] + '.anyconf',JSON.stringify(AnyJSON),(err)=>{
						if(err) throw err
					})
					fs.readFile("./config/dashboard.json",'utf8',(err,data) => {
						if(err){
							throw new Error('dashboard.json cannot be found or read.Please check your filesystem.');
						}
						var jsonDashBoard = eval('(' + data + ')');
						var jsonFname = evt_Fname.split('_any')[0] + '.' + evt_Fname.split('.')[1];
						if(jsonDashBoard.flist == ''){
							jsonDashBoard.flist = jsonFname;
						}else{
							jsonDashBoard.flist = jsonDashBoard.flist + "," + jsonFname;
						}
						jsonDashBoard[jsonFname] = evt_Fname;
						fs.writeFile("./config/dashboard.json",JSON.stringify(jsonDashBoard),(err)=>{
							if(err) throw err
							console.log("save completed")
						})
					});
				}
			})
		break;
	}
})

router.get('/',function(req,res,next){
	res.end();
})

module.exports = router;