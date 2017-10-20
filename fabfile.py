from __future__ import print_function
import os
from fabric.operations import local, put
from fabric.context_managers import lcd, cd
from fabric.contrib.project import rsync_project
from fabric.api import run, env, hosts

RSYNC_EXTRA = '--keep-dirlinks --safe-links --links --perms --omit-dir-times'

if platform.system() == 'Darwin':
    RSYNC_EXTRA += ' --iconv=utf-8-mac,utf-8'

@hosts(['deploy@server-name'])
def deploy_gunicorn():
    rsync_project(
        '/home/deploy/app',
        os.path.dirname(__file__) + '/python',
        exclude=['.*', '*.pyc', '__pycache__', 'tmp', 'doc', 'node_modules', 'venv'],
        extra_opts=RSYNC_EXTRA,
    )
    run('/home/deploy/app/venv/bin/pip install --upgrade -r /home/deploy/app/requirements.freeze.txt')
    run('systemctl --user reload gunicorn')