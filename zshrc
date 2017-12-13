if [ -d ~/.oh-my-zsh ] ; then
    export ZSH_THEME="af-magic"
    export ZSH=~/.oh-my-zsh
    export DISABLE_UPDATE_PROMPT=true
    plugins=(
        git docker python fabric
    )
    source ~/.oh-my-zsh/oh-my-zsh.sh
fi

source rc.sh
export HISTFILE=~/.zsh_history