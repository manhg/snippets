MY=https://raw.githubusercontent.com/manhg/snippets/master
curl $MY/.rc > ~/.rc
curl $MY/bashrc > ~/.bashrc

if [ command -v zsh ]; then
    curl $MY/zshrc > ~/.zshrc
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
    curl https://raw.githubusercontent.com/rupa/z/master/z.sh > ~/.z
fi

mkdir ~/.bin
curl https://getmic.ro | bash
mv micro ~/.bin
mkdir -p ~/.config/micro
curl $MY/micro_shortcuts.json > ~/.config/micro/bindings.json