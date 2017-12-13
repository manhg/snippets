source rc.sh
export PS1="\[\033[38;5;11m\]\u\[$(tput sgr0)\]\[\033[38;5;6m\] \w ■ \[$(tput sgr0)\]\[\033[38;5;15m\] \[$(tput sgr0)\]"
export HISTFILE=~/.bash_history
shopt -s histappend
export HISTCONTROL=ignorespace
export PROMPT_COMMAND="history -a; history -n; ${PROMPT_COMMAND}"
