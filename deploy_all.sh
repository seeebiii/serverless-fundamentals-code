#!/bin/sh

cd autocomplete-data-store
sls deploy
cd ../autocomplete-data-producer
sls deploy
cd ../autocomplete-data-worker
sls deploy
cd ../autocomplete-api
sls deploy
