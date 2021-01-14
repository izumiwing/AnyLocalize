# AnyLocalize
The excellent localize tools for both person and team.Explorer the fun of translating.
适合 个人/团队 出色的汉化（本地化）工具，适用于几乎所有读写文本，无论是汉化游戏，还是翻译字幕，都能体验到最佳的汉化流程，快速完成汉化翻译。

在当前阶段，特性部分功能还不可用。

# AnyLocalize Readme
1.使用教程
2.特性介绍

# AnyLocalize 使用

## 安装起步
```
npm install
npm start
```
在根目录下启动 npm 安装依赖后启动即可。随后在浏览器中访问：
```
http://localhost:3000 
```
也可以自行在 bin\www 中更改，同时支持多个人在线同时翻译。

进入页面后，你可以清晰的发现布局左侧是文件选择菜单，右侧为主要操作区域。首次进入并不存在任何project，所以通过左上方"+Create Project"创建新project

## 新建project

```
详细配置解释：
Select suitable methods:选择适合该文本的操作方式，当前只有Delimiter Split一种，也就是分隔符切割。
Delimiter:输入一个分隔符
举例：LocalButton,Local。若要翻译的文本是Local，则分隔符即","
举例：HND_Btn_Load "Load"; 若要翻译的文本时Load，则分隔符为" "（空格）
凡是在翻译文本前方出现的任意字符，只要与要翻译的文本之间所隔字符数相同都可以。
（如果不理解，可以设置任意你觉得有可能的字符，之后脚本会自动检测是否正确）
Phrase Position:要翻译的语句位于分割符的何处，此处只有After the delimiter一种，也就是位于分隔符之后
（暂未发现有其他情况）
Delimiter (Secondary):次要分隔符，当前版本并无作用，但为后期若出现两个分隔符之间的语句做铺垫，形如HTML语言。
Is the text has prefix(s)?:文本是否有前缀，若有可以选择Yes。
举例："This is a text"。有前缀。
举例：This is a text; 无前缀。
（有前缀和无前缀，与文本是否被特定字符括起来可以画上等号）
Text prefix:有前缀的话则输入一个前缀即可。

Ignore current line if appear char(s):当出现有一些字符时，就跳过这一行的文本，这样就不会被导到翻译工作流中。
Manually select the range of localization file:当只希望翻译的这部分只是在文件的某几行之中，可以选择Yes来手动指定要翻译的范围。
Localization phrases start from line:手动选择开始翻译的行数。
Localization phrases end in line:手动选择结束翻译的行数。

Please type the first phrase:输入第一行你要翻译的字符，来检测你配置的是否正确。
Please type the second phrase:输入第二行你要翻译的字符，来检测你配置的是否正确。
Please type the third phrase:输入第三行你要翻译的字符，来检测你配置的是否正确。
```
当完成配置点击Submit后，会跳出"submitted"，然后手动返回一下刷新（在之后的版本会改进这一设计）。若配置无误，并且文件确实符合脚本运行规律，就会被添加到左方文件菜单中。

## 开始翻译

此时点击左方刚刚添加的文件。若正常配置，则就已经开始了翻译流程。此处可以看到：页面交互的地方 深蓝下划线 上的语句，便是你需要翻译成你所需要的语言的语句，在下方的"Translation goes here"提示符输入框中输入你翻译后的结果，点击下方OK即可提交给服务器。若此时不确定此处的具体意思，可以先点击Skip之后，它会被重新加入到翻译流的最后，直到有人对此句点击OK。

此时你可以再打开一个页面并从左侧菜单选择该文件，你会发现页面出现的 深蓝下划线 上的语句与你之前打开页面的语句不一样，因为它会自动将不同的语句分配给每次请求翻译该文件的页面的用户。不过若该用户没有点击OK，也就是说没有翻译，该语句是不会离开翻译流，会紧接着最后一个翻译语句之后出现，直到所有语句完成，它都不可能消失。所以可以找寻多个人一同参加翻译该文件，加快翻译的进度。

（当前并不支持中途保存，所以请确保运行AnyLocalize的服务器一直保持开启，直到翻译完成后，会自动保存。

## 下载

若翻译流全部完成后，会自动将翻译流整合成原本导入的文件，并在下方会有Download按钮（与OK，Skip在同一行）即可下载翻译过后的原始文件。

# AnyLocalize 特性

## AnyLocalize 广泛通用
你可以导入任意文件来体验最佳的汉化翻译流程，你只需要选择合适的选项，填入一些关于汉化文件的格式问题（如：每个需要翻译的文本前方出现了什么字符）即可体验可视化的翻译流程。不管是需要翻译音乐歌词（*.lrc）还是游戏汉化（*.locale，*.locres），只需要导出成能正常查看编辑的文件，导入AnyLocalize，就可以进一步体验完美的翻译过程。

## 支持多人协同使用
当有一个团队的时候，AnyLocalize 可以根据每个成员翻译的文本，来分发未经翻译的文本字段给成员，即使一个成员无法单独完成翻译，也可以手动标注这个字段“待翻译”这样就会再次分发给其他成员。

## 文件更新，本地化文件也更新
如果文件更新了，可以导入新的本地化文件，AnyLocalize 会根据更新后的文件与更新前的文件来重新组合，将新增字段加入到翻译的工作流中，不需要从头再来。

## AnyLocalize 会利用 Google Translate 提供单词翻译
机器翻译可以帮助你快速了解单词意思，同时也不会翻译一些过于基本的单词（如：what,who,when,a,an,the,you...)
