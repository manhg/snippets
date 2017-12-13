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
alias du10='du --max-depth=1 | sort -n -r | head -n 10'
alias tm='tmux attach -t default || tmux new -s default'
alias glg="git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) \
    %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative --max-count=15"
alias gmt='git mergetool'
alias gpr='git pull --rebase'
alias grc='git rebase --continue'
alias gst='git status'
alias gc='git commit -a'
alias gexp='git archive --format gzip --output'
alias git1="git clone --depth=1"
alias gbs="git clone --depth=1 --single-branch -b " # Usage: gbs {branch} {repo}
alias gca="git add . && git commit -C HEAD --amend"

export HISTFILESIZE=100000
export HISTSIZE=100000
export HISTTIMEFORMAT="[%F %T] "
export HISTCONTROL=ignoredups;
export HISTIGNORE=""

export GOPATH=~/.gopath

case "$OSTYPE" in
    darwin*)
        export HOMEBREW_NO_AUTO_UPDATE=1
        export PATH="/usr/local/opt/coreutils/libexec/gnubin:/usr/local/bin/:$PATH:$GOPATH/bin"
        if [ -f /usr/local/bin/virtualenvwrapper_lazy.sh ]; then
            export VIRTUALENVWRAPPER_PYTHON=/usr/local/bin/python3
            source /usr/local/bin/virtualenvwrapper_lazy.sh
        fi
        alias komodo='open -a "Komodo Edit 11"'
        export HH_CONFIG=hicolor
        bindkey -s "\C-r" "\eqhh\n"     # bind hh to Ctrl-r (for Vi mode check doc)
        if [ $(which autossh) ]; then
            autossh -M 6400 -f
        fi
        ;;
        
    linux*)
        if [ -f /usr/bin/virtualenvwrapper_lazy.sh ]; then
            source /usr/bin/virtualenvwrapper_lazy.sh
        fi
        [ -f /etc/bash_completion ] && . /etc/bash_completion
esac