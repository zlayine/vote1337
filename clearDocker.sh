#!/bin/bash

sudo docker volume rm -f $(sudo docker volunes ls)

sudo docker rmi $(sudo docker images -f -q)

sudo docker rm $(sudo docker ps -a -f -q)
