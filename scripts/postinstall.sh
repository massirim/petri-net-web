#!/bin/bash

echo "##############################"
echo "Installing bower dependencies"

bower install

echo "##############################"
echo "Selecting enviroment"

if [ "$NODE_ENV" == "production" ];
then
    ENV="PRD"
else
    ENV="DEV"
fi

case "$ENV" in
        PRD|DEV)
                echo "Setting enviroment for $ENV"
                cp ./app/config/settings.$ENV.js ./app/config/settings.js
                ;;
        *)
                echo "WARNING: No enviroment was defined"
                ;;
esac

echo "##############################"
echo "Building application"

grunt