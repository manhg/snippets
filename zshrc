# If not running interactively, don't do anything
[[ $- != *i* ]] && return

source .rc
if [ -d ~/.oh-my-zsh ] ; then
    export ZSH_THEME="af-magic"
    export ZSH=~/.oh-my-zsh
    export DISABLE_UPDATE_PROMPT=true
    plugins=(
        git docker python fabric z common-aliases osx
    )
    source ~/.oh-my-zsh/oh-my-zsh.sh
fi
export HISTFILE=~/.zsh_history