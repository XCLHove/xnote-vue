#!/bin/bash
cd dist || exit 1
tar -zcf xnote-vue.tar.gz ./* || exit 1