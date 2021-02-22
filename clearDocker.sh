#!/bin/bash

sudo docker volume rm -f $(sudo docker volunes ls)

sudo docker rmi $(sudo docker images -f -q)

docker rmi $(docker images -f "dangling=true" -q)

sudo docker rm $(sudo docker ps -a -f -q)
