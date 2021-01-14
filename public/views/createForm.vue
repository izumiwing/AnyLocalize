
<div class="createTitle">
	<h1>Create a new Project</h1>
</div>
<div class="createOptions">
	<form action="/createProject/Upload" method="post" enctype="multipart/form-data">
		<div class="optionBox">
			Select the file you wanna translate:
			<input id="file" type="file" name="file" />
		</div>
		<div class="optionBox">
			<div class="optionList">
				Select suitable methods:
				<div class="formList">
					<select name="mode" onchange="">
						<option value="DelimiterSplit">Delimiter Split</option>
					</select>
				</div>
			</div>
		</div>
		<div id="DelimiterSplit" class="optionBox">
			<div class="optionList">
				Delimiter:<input name="ds_dlmt" type="text" class="optionInputText"/>
			</div>
			<div class="optionList">
				Phrases position:
				<div class="formList">
					<select name="ds_pp">
						<option value="right">After the delimiter.</option>
					</select>
				</div>
			</div>
			<div class="optionList">
				Delimiter (Secondary) : <input name="ds_dlmt2" type="text" class="optionInputText"/>
			</div>
			<div class="optionList">
				Is the text has prefix(s)?
				<div class="formList">
					<label><input type="radio" name="ds_tpANS" value="yes" />Yes</label>
					<label><input type="radio" name="ds_tpANS" value="no" checked />No</label>
				</div>
			</div>
			<div class="optionList">
				Text prefix : <input name="ds_tp" type="text" class="optionInputText"/>
			</div>
		</div>
		<div class="optionBox">
			<div class="optionList">
				Ignore current line if appear char(s):<input name="ignoreChar" type="text" class="optionInputText"/>
			</div>
			<div class="optionList">
				Manually select the range of localization file:
				<div class="formList">
					<label><input type="radio" name="locposANS" value="yes" />Yes</label>
					<label><input type="radio" name="locposANS" value="no" checked />No</label>
				</div>
			</div>
			<div class="optionList">
				Localization phrases start from line:<input name="startpos" type="number" class="optionInputText"/>
			</div>
			<div class="optionList">
				Localization phrases end in line:<input name="endpos" type="number" class="optionInputText"/>
			</div>
		</div>
		<div class="optionBox">
			<div class="optionList">
				Please type the first phrase<input name="validatePhrase0" type="text" class="optionInputText"/>
			</div>
			<div class="optionList">
				Please type the second phrase<input name="validatePhrase1" type="text" class="optionInputText"/>
			</div>
			<div class="optionList">
				Please type the third phrase<input name="validatePhrase2" type="text" class="optionInputText"/>
			</div>
			<a>*Note: Entering the first 3 phrases you wanna translate properly to make sure we are working properly.</a>
		</div>
		<div class="submitBox">
			<input class="formButton" type="submit" value="提交"/>
		</div>
	</form>
	<br>
</div>