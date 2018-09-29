#!/bin/bash
rm -rf ./src/module/hokprotobuf.d.ts
rm -rf ./dist/src/module/hokprotobuf.js
echo '生成文件 hokprotobuf.js...'
pbjs -t static-module -w commonjs -o hokprotobuf.js proto/*.proto
echo '开始生成./src/module/hokprotobuf.d.ts...'
pbts -o ./src/module/hokprotobuf.d.ts hokprotobuf.js
echo '生成 hokprotobuf.d.ts [OK]'
mv hokprotobuf.js ./dist/src/module/
echo '移动js文件到 ./dist/src/module/hokprotobuf.js [OK]'
echo '脚本执行 [OK]'