#!/bin/bash

echo -e "\033[1;32mUpdating the app...\033[0m"

echo -e "\033[1;32mTurning off services..\033[0m"
sudo docker-compose down &> /dev/null

echo -e "\033[1;32mBuilding with the new content...\033[0m"
sudo docker-compose build &> /dev/null

echo -e "\033[1;32mStarting the services...\033[0m"
sudo docker-compose up -d &> /dev/null

clear
echo -e "\033[1;32mAll Good!\033[0m"
