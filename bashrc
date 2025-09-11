# If not running interactively, don't do anything
[[ $- != *i* ]] && return

# lift history limit
export HISTFILE=~/.bash_history
shopt -s histappend
export HISTCONTROL=ignorespace
export PROMPT_COMMAND="history -a; history -n; ${PROMPT_COMMAND}"
export HISTTIMEFORMAT="%y/%m/%d %T "
export HISTSIZE=100000

export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
export MANPAGER="less -X" # Don't clear the screen after quitting a manual page
export PYTHONIOENCODING=utf-8
export PYTHONUNBUFFERED=1
export PYTHONWARNINGS="ignore:Deprecation"

export JAVA_OPTS="-Xms32m -Xmx256m"
export JVM_OPTS=$JAVA_OPTS
alias l='ls --color=auto --classify --group-directories-first --human-readable --quoting-style=literal'
alias l.='ls -d .* --color=auto' # show hidden only
alias ll='l -la' # show all
alias rand='dd if=/dev/urandom bs=128 count=1 2>/dev/null | base64 | cut -c -16'
alias du1='du -h --max-depth=1'
alias ip4='ip a|grep "inet "'
alias ip6='ip a|grep "inet6 "'
alias du10='du --max-depth=1 | sort -n -r | head -n 10'
alias tm='tmux attach -t default || tmux new -s default'
alias glg="git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) \
    %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative --max-count=15"
alias gfh="git log --expand-tabs=4 --follow --abbrev-commit --date=relative -p -- " # Usage: gfh {file/folder} all change diff on a file/a folder
alias gmt='git mergetool'
alias gpr='git pull --rebase'
alias grm='git rebase --committer-date-is-author-date master'
alias grc='git rebase --continue'
alias gst='git status'
alias gc='git commit -a'
alias gexp='git archive --format gzip --output'
alias git1="git clone --depth=1"
alias gbs="git clone --depth=1 --single-branch -b " # Usage: gbs {branch} {repo}
alias gca="git add . && git commit -C HEAD --amend"
alias dlg="docker-compose logs -f --tail=20 "
export GOPATH=~/.gopath
export PATH=$PATH:~/.bin:./node_modules/.bin

if [ -f /usr/bin/virtualenvwrapper_lazy.sh ]; then
    source /usr/bin/virtualenvwrapper_lazy.sh
fi
[ -f /etc/bash_completion ] && . /etc/bash_completion

if [ -z "$SSH_AUTH_SOCK" ] ; then
    eval `ssh-agent -s` &> /dev/null
    ssh-add &> /dev/null
fi

function check_port {
    # usage: check_port domain.com port_number
    timeout 3 sh -c 'cat < /dev/null > /dev/tcp/$1/$2' && echo "Open" || echo "Closed"
}

PS_COLOR="\[$(tput setaf 3)\]"
RESET="\[$(tput sgr0)\]"
export PS1="${PS_COLOR}\u@\h \w \$ ${RESET}"

