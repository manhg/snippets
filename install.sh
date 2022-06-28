MY=https://raw.githubusercontent.com/manhg/snippets/master
curl $MY/.rc > ~/.rc
curl $MY/bashrc > ~/.bashrc
echo 'source .bashrc' >> .bash_profile
apt-get update
apt-get install bash-completion curl git docker-compose postfix ufw psmisc fail2ban gnupg logcheck rsync
ufw allow 3389
ufw allow 9622
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
curl -L https://raw.githubusercontent.com/rupa/z/master/z.sh > ~/.z.sh
echo 'source .z.sh' >> .bashrc

echo '\nPort = 9622\nPasswordAuthentication no' >> /etc/ssh/sshd_config
echo '\n[sshd]\nport = 9622' >> /etc/fail2ban/jail.local
echo '' > /etc/motd
systemctl reload sshd
systemctl reload fail2ban
