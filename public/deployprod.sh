#!/bin/bash

cd /var/www

PROJECT="triggmine"
DEPLOY_FILE_NAME="deploy.prod.tar.gz"
PROJECT_FOLDER="/var/www/triggmine-ico"

APP_FOLDER="${PROJECT_FOLDER}/app"
ADMIN_FOLDER="${PROJECT_FOLDER}/admin"
API_FOLDER="${PROJECT_FOLDER}/api"
PUBLIC_FOLDER="${PROJECT_FOLDER}/public"
DEPLOY_FILE_PATH="/var/www/${DEPLOY_FILE_NAME}"

dt=`date '+%d-%m-%Y_%H-%M-%S'`
BACKUP_FOLDER="${PROJECT_FOLDER}_bkp_${dt}"

sudo mkdir -p "${BACKUP_FOLDER}"
sudo cp -R "${PROJECT_FOLDER}/" "${BACKUP_FOLDER}"

sudo rm -rf "${API_FOLDER}"
sudo rm -rf "${APP_FOLDER}"
sudo rm -rf "${ADMIN_FOLDER}"
sudo rm -rf "${PUBLIC_FOLDER}"
sudo rm -f "${DEPLOY_FILE_PATH}"

read -p "Enter filename to download from bitbucket, default [${DEPLOY_FILE_NAME}] " NEWFILE
[ -n "${NEWFILE}" ] && DEPLOY_FILE_NAME=$NEWFILE

read -p "Enter bitbucket login " USER
URL="https://bitbucket.org/nordwhaleteam/${PROJECT}/downloads/${DEPLOY_FILE_NAME}"
sudo curl -L -su "${USER}" "${URL}" -o "${DEPLOY_FILE_NAME}"

sudo mkdir deploy
sudo tar -xf "./${DEPLOY_FILE_NAME}" -C ./deploy
sudo mv ./deploy/app/build "${APP_FOLDER}"
sudo mv ./deploy/admin/build "${ADMIN_FOLDER}"

if [ -f "${API_FOLDER}/pm2.prod.config.json" ] ; then
    sudo pm2 stop "${API_FOLDER}/pm2.prod.config.json"
fi

if [ -f "${API_FOLDER}/pm2-cron-prod.json" ] ; then
    sudo pm2 stop "${API_FOLDER}/pm2-cron-prod.json"
fi

sudo mv ./deploy/api "${API_FOLDER}"
sudo cp ./.env "${API_FOLDER}/.env"

sudo rm -rf /var/www/deploy/api /var/www/deploy/app /var/www/deploy/admin

sudo mv ./deploy "${PUBLIC_FOLDER}"

cd "${API_FOLDER}"

sudo pm2 start pm2.prod.config.json

if [ -f "${API_FOLDER}/pm2-cron-prod.json" ] ; then
    sudo pm2 start pm2-cron-prod.json
fi

curl -X POST --data-urlencode "payload={\"channel\": \"#triggmine_ico\", \"text\": \"${USER} deployed ${DEPLOY_FILE_NAME}. Please check <http://triggmine.z.od.ua/> or <http://18.197.8.2/>\"}" https://hooks.slack.com/services/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


