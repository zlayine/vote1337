#!/bin/bash

echo -e "\033[1;32mChecking DOCKER!\033[0m"

if ! $(docker ps &> /dev/null) ; then

	echo -e "\033[1;32mDocker is not running..Starting docker\033[0m"

	if ! $(sudo systemctl start docker &> /dev/null) ; then

		echo -e "\033[1;32mDocker not installed..Installing\033[0m"

		curl -fsSL https://get.docker.com/ | sh &> /dev/null

		echo -e "\033[1;32mDocker installed..Starting docker\033[0m"

		if ! $(sudo systemctl start docker &> /dev/null) ; then
			echo "Docker is not properly installed..exiting"
			exit 1
		fi

		sudo systemctl enable docker &> /dev/null

		if ! $(docker ps &> /dev/null) ; then
			echo "Docker is not properly installed..exiting"
			exit 1
		fi
	fi
fi

echo -e "\033[1;32mDocker is running..Checking docker-compose\033[0m"

if ! $(docker-compose --version &> /dev/null) ; then
	echo -e "\033[1;32mDocker compose is not installed..Installing\033[0m"

	sudo curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose &> /dev/null

	sudo chmod +x /usr/local/bin/docker-compose &> /dev/null
	
	sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
	
	if ! $(docker-compose --version &> /dev/null) ; then
		echo "Docker compose is not properly installed..exiting"
		exit 1
	fi
fi
clear
echo -e "\033[1;32mDocker and docker-compose are running..\033[0m"