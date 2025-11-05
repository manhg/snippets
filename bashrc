# If not running interactively, don't do anything
[[ $- != *i* ]] && return


# lift history limit
export HISTFILE=~/.bash_history
shopt -s histappend
export HISTCONTROL=ignorespace
export PROMPT_COMMAND="history -a; history -n; ${PROMPT_COMMAND}"
export HISTTIMEFORMAT="%y-%m-%d %T "
export HISTSIZE=100000

export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
export PYTHONIOENCODING=utf-8
export PYTHONUNBUFFERED=1
export PYTHONWARNINGS="ignore:Deprecation"
export JAVA_OPTS="-Xms32m -Xmx256m"
export JVM_OPTS=$JAVA_OPTS

alias l='ls --color=auto --classify --group-directories-first --human-readable --quoting-style=literal'
alias l.='ls -d .* --color=auto' # show hidden only
alias ll='l -la' # show all
alias rand='dd if=/dev/urandom bs=128 count=1 2>/dev/null | base64 | cut -c -16 | head -n 1'
alias du1='du -h --max-depth=1'
alias du10='du --max-depth=1 | sort -n -r | head -n 10'
alias ip4='ip a|grep "inet "'
alias ip6='ip a|grep "inet6 "'
alias ips="ip a | grep inet"
alias ports="lsof -nP -iTCP -sTCP:LISTEN"

dlogs() {
    docker-compose logs -f --tail=${1:-100}
}
jlogs() {
    journalctl -f --lines=${1:-100}
}


unset PROMPT_COMMAND
export HISTSIZE=100000


PS_COLOR="\[$(tput setaf 3)\]"
RESET="\[$(tput sgr0)\]"
export PS1="${PS_COLOR}\u@\h \w \$ ${RESET}"

[ -f /etc/bash_completion ] && . /etc/bash_completion
