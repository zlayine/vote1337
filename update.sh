#!/bin/bash

echo -e "\033[1;32mUpdating the app...\033[0m"

echo -e "\033[1;32mTurning off services..\033[0m"
sudo docker-compose down &> /dev/null

if [ $1 ]
then
	echo -e "\033[1;32mSetting integration environment...\033[0m"
	cp ./environment/integration.json ./environment/production.json
	cp ./frontend/.env.integration ./frontend/.env.production
fi

echo -e "\033[1;32mBuilding with the new content...\033[0m"
sudo docker-compose build

echo -e "\033[1;32mStarting the services...\033[0m"
sudo docker-compose up -d &> /dev/null

clear
echo -e "\033[1;32mServices are ready for use!\033[0m"
