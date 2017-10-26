#!/bin/bash
if [ "$NODE_ENV" == "production" ];
then
    ENV="PRD"
else
    ENV="DEV"
fi

echo $ENV