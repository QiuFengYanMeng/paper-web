#!/bin/bash 
echo "传输文件"
scp -P 10012 -r ./** root@122.4.205.228:/data/avue/avuex-data
echo "部署成功"