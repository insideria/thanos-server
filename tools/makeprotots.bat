@echo off
:菜单
cls
echo =================================================
echo       继续执行将会删除以前生成的文件，是否继续？
echo 1.是
echo 2.否
echo.
set /p 选择=请进入命令：
if %选择%==1 goto yes
if %选择%==2 goto no

:yes
echo '将要删除以前生成的文件。。。'
del src\module\hokprotobuf.d.ts
del dist\src\module\hokprotobuf.js
echo '生成文件 hokprotobuf.js...'
call pbjs -t static-module -w commonjs -o hokprotobuf.js proto/*.proto
echo '开始生成./src/module/hokprotobuf.d.ts...'
call pbts -o ./src/module/hokprotobuf.d.ts hokprotobuf.js
echo '生成 hokprotobuf.d.ts [OK]'
move hokprotobuf.js ./dist/src/module/
echo '移动js文件到 ./dist/src/module/hokprotobuf.js [OK]'
echo '脚本执行 [OK]'
goto end

:no
goto end

:end
