MY=https://raw.githubusercontent.com/manhg/snippets/master
curl $MY/.rc > ~/.rc
curl $MY/bashrc > ~/.bashrc
echo 'source .bashrc' >> .bash_profile

if [ -f /bin/zsh ]; then
    curl $MY/zshrc > ~/.zshrc
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
    curl https://raw.githubusercontent.com/rupa/z/master/z.sh > ~/.z
fi

if [ ! -f ~/.bin/micro ]; then
    mkdir ~/.bin
    curl https://getmic.ro | bash
    mv micro ~/.bin
    mkdir -p ~/.config/micro
    curl $MY/micro_shortcuts.json > ~/.config/micro/bindings.json
fi

if [ ! -f /usr/local/bin/dry ]; then
    curl -sSf https://moncho.github.io/dry/dryup.sh | sudo sh
    sudo chmod 755 /usr/local/bin/dry
fi