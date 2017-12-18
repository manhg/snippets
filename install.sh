MY=https://raw.githubusercontent.com/manhg/snippets/master
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
curl $MY/.rc > ~/.rc
curl $MY/zshrc > ~/.zshrc
curl $MY/bashrc > ~/.bashrc
curl https://raw.githubusercontent.com/rupa/z/master/z.sh > ~/.z

mkdir ~/.bin
curl https://getmic.ro | bash
mv micro ~/.bin
mkdir -p ~/.config/micro
curl $MY/micro_shortcuts.json ~/.config/micro/bindings.json