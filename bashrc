# If not running interactively, don't do anything
[[ $- != *i* ]] && return

source .rc
export PS1="\[\033[38;5;9m\]\u@\h \w ■\[$(tput sgr0)\] "
export HISTFILE=~/.bash_history
shopt -s histappend
export HISTCONTROL=ignorespace
export PROMPT_COMMAND="history -a; history -n; ${PROMPT_COMMAND}"
