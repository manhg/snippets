from __future__ import print_function
import os
from fabric.operations import local, put
from fabric.context_managers import lcd, cd
from fabric.contrib.project import rsync_project
from fabric.api import run, env, hosts
from fabric.colors import red, green

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
    
    
def check_dirty(deploy_branch='master', git_path=os.path.dirname(__file__)):
    with lcd(git_path):
        git_state = local('git status --porcelain', capture=True)
        git_branch = local('git rev-parse --abbrev-ref HEAD', capture=True)
        clean = git_state == ''
        if not clean:
            print(red("Git is not clean"))
            is_forced = None
            try:
                is_forced = raw_input('Force deploy? (y/N) ')
            except:
                is_forced = input('Force deploy? (y/N) ')
            
            is_forced = is_forced.upper() == 'Y' 
            if not is_forced:
                raise SystemExit()
        if git_branch != deploy_branch:
            print(red("Deploy branch differrent: "), git_branch, red("expected:"), deploy_branch)
            raise SystemExit()