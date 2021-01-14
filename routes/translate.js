var express = require('express');
var path = require('path')
var fs = require('fs');
var router = express.Router();
var FileNameList = {};
var TranslateProg = {};
var TranslateFlow = {};
var FlowIsTidy = true;

var readLine = require("readline");
var events = require('events');
var eventEmitter = new events.EventEmitter();

fs.readFile(".\\config\\dashboard.json",'utf8',(err,data) => {
	if(err){
		throw new Error('dashboard.json cannot be found or read.Please check your filesystem.');
	}
	console.log('[AnyLocalize] Calculating the progress for each localization file...')
	var jsonDashBoard = eval('(' + data + ')');
	if(jsonDashBoard.flist != ''){
		var fileList = jsonDashBoard.flist.split(',');
		fileList.forEach(function(item,index){
			FileNameList[item] = jsonDashBoard[item];
			TranslateProg[item] = require('..\\config\\translate\\' + FileNameList[item].split('.')[0] + '.js');
			var localizedCounter = 0;
			TranslateFlow[item] = new Array();
			TranslateProg[item].foreignLang.forEach(function(item2,index2){
				if(item2 != TranslateProg[item].localizedLang[index2]){
					localizedCounter++;
				}else{
					TranslateFlow[item][index2] = {translateSource:item2,line:index2,status:true};
				}
			})
			console.log('[' + localizedCounter + '/' + TranslateProg[item].foreignLang.length + '] ' + FileNameList[item] + '')
		})
		console.log('[AnyLocalize] *NOTE: [0/999] 0 = Already translated. 999 = Total needs.')
	}else{
		console.log('[AnyLocalize] No files!')
	}
});

router.post('/',function(req,res,next){
	var reqFile = req.body.reqFile;
	var reqType = req.body.reqType;
	var PkgSend = {};
	switch(reqType){
		case 0:
			if(TranslateFlow[reqFile].length == 0){
				PkgSend = {translateSource:'This localization is completed!',line:-1,status:true};
			}else{
				TranslateFlow[reqFile] = TranslateFlow[reqFile].filter((item,index)=>{
					return item.status;
				});
				TranslateFlow[reqFile].push({translateSource:TranslateFlow[reqFile][0].translateSource,line:TranslateFlow[reqFile][0].line,status:true});
				TranslateFlow[reqFile][0].status = false;
				PkgSend = TranslateFlow[reqFile][0];
			}
			break;
		case 1:
			try{
			var reqLine = req.body.reqLine;
			var reqPhrase = req.body.reqPhrase;
			TranslateProg[reqFile].localizedLang[reqLine] = reqPhrase;
			TranslateFlow[reqFile] = TranslateFlow[reqFile].filter((item,index)=>{
				return item.line != reqLine;
			})
			if(TranslateFlow[reqFile].length == 0){
				PkgSend = {translateSource:'This localization is completed!',line:-1,status:true};
				eventEmitter.emit('compileLocalization',FileNameList[reqFile]);
			}else{
				PkgSend = TranslateFlow[reqFile][0];
			}
			}catch(err){console.log(err)}
			break;
		case 2:
			if(TranslateFlow[reqFile].length == 0){
				var f = fs.createReadStream('./config/localized/' + FileNameList[reqFile])
				res.writeHead(200,{
					'Content-Type': 'application/force-download',
					'Content-Disposition':'attachment; filename=' + reqFile
				})
				f.pipe(res);
			}else{
				res.end(404);
			}
			break;
	}
	if(reqType != 2){
		res.end(JSON.stringify(PkgSend))
	}
})

eventEmitter.on('compileLocalization',function(compileFileName){
	var fname = compileFileName.split('.')[0] + '.anyconf';
	var compileTranslateProg = TranslateProg[fname.split('_any')[0] + '.' + compileFileName.split('.')[1]];
	var arr = [];
	var arrTextConn = '';
	
	fs.readFile(".\\config\\translate\\" + fname,'utf8',function(err,data){
		if(err){
			throw new Error('dashboard.json cannot be found or read.Please check your filesystem.');
		}
		var AnyJSON = eval('(' + data + ')');
		
		var readObj = readLine.createInterface({
			input: fs.createReadStream('./config/source/' + AnyJSON.source)
		});
		
		var counter = 1;
		var jmpFlag = false;
		readObj.on('line',function(line){
			jmpFlag = false;
			if(AnyJSON.locposANS){
				if(counter < Number(AnyJSON.startpos) || counter > Number(AnyJSON.endpos)){
					jmpFlag = true;
					arr.push(line);
				}
				counter++;
			}
			if(!jmpFlag){
				if(AnyJSON.ds_tpANS && line.trim() != ''){
					var prefixAlign = false;
					var isWrap = false;
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
						isWrap = true;
						line = '';
					}else{
						//line = line.replace(RegExp(AnyJSON.ds_tp,'g'),'');
					}
				}
				if(AnyJSON.ignoreChar != ''){
					if(line.indexOf(AnyJSON.ignoreChar) == -1){
						if(line.trim() != ''){
							compileTranslateProg.foreignLang.forEach((item,index) => {
								if(line.indexOf(item) != -1){
									arr.push(line.replace(item,compileTranslateProg.localizedLang[index]));
								}
							})
							
						}
					}else{
						if(!isWrap){
							arr.push(line);
						}
					}
				}else{
					if(line.trim() != ''){
						compileTranslateProg.foreignLang.forEach((item,index) => {
							if(index == 2){
								//console.log(item);
								//console.log(line);
							}
							if(line.indexOf(item) != -1){
								arr.push(line.replace(item,compileTranslateProg.localizedLang[index]));
							}
						})
					}else{
						if(!isWrap){
							arr.push(line);
						}
					}
				}
			}
		})
		
		readObj.on('close',function(){
			var fileHeader = '';
			arr.forEach((item,index) => {
				fileHeader = fileHeader + item + '\r\n';
			})
			fs.writeFile('./config/localized/'+ AnyJSON.source,fileHeader,(err)=>{
				if(err) throw err
			})
			eventEmitter.emit('saveLocalization',compileFileName,compileTranslateProg);
		})
	})
})

eventEmitter.on('saveLocalization',function(compileFileName,compileTranslateProg){
	var arr = compileTranslateProg.foreignLang;
	var arrStr = 'new Array('
	var arrStrLoc = 'new Array('
	arr.forEach((item,index) => {
		item = item.replace(/'/g,'\\' + '\'');
		compileTranslateProg.localizedLang[index] = compileTranslateProg.localizedLang[index].replace(/'/g,'\\' + '\'');
		if(index != arr.length - 1){
			arrStr = arrStr + '\'' + item + '\',';
			arrStrLoc = arrStrLoc + '\'' + compileTranslateProg.localizedLang[index] + '\',';
		}else{
			arrStr = arrStr + '\'' + item + '\')'
			arrStrLoc = arrStrLoc + '\'' + compileTranslateProg.localizedLang[index] + '\')';
		}
	})
	var fileHeader = 'var foreignLang = ' + arrStr + "\r\n" + 'var localizedLang = ' + arrStrLoc + "\r\n" + 'module.exports = { foreignLang,localizedLang }'
	fs.writeFile('./config/translate/'+compileFileName.split('.')[0] + '.js',fileHeader,(err)=>{
		if(err) throw err
	})
})

router.get('/',function(req,res,next){
	res.end(200);
})

module.exports = router;