sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
curl https://raw.githubusercontent.com/manhg/snippets/master/.rc > ~/.rc
curl https://raw.githubusercontent.com/manhg/snippets/master/zshrc > ~/.zshrc
curl https://raw.githubusercontent.com/manhg/snippets/master/bashrc > ~/.bashrc
curl https://raw.githubusercontent.com/rupa/z/master/z.sh > ~/.z

mkdir ~/.bin
curl https://getmic.ro | bash
mv micro ~/.bin