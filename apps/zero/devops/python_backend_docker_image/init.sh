#!/bin/sh

export PATH="$PATH:/opt/mssql-tools/bin"
/usr/sbin/sshd
git init python_app
cd python_app
git remote add origin git@github.com:MichaelOdumosu57/nibls_coin_website.git
git config core.sparsecheckout true
echo "apps/zero/backend/flask/dev*" >> .git/info/sparse-checkout
git pull --depth=1 origin master
cd apps/zero/backend/flask/dev
pip install -r requirements.txt
gunicorn -k gevent -w 1 app:app
