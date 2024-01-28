#!/bin/bash
# 切换到打包目录
cd dist || exit 1

# 压缩打包文件
tar -zcf xnote-vue.tar.gz ./* || exit 2

# 删除多余文件，只保留压缩文件
find . -type f ! -name '*.tar.gz' -delete || exit 3
find . -type d ! -name '*.tar.gz' -delete || exit 4
