MY=https://raw.githubusercontent.com/manhg/snippets/master

# basic tools
curl $MY/bashrc > ~/.bashrc
echo 'source .bashrc' >> .bash_profile
apt-get update
apt-get install bash-completion curl git docker-compose postfix ufw psmisc fail2ban gnupg logcheck rsync

# firewall
ufw allow 3389
ufw allow 9622
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable

# secure shell
echo '\nPort = 9622\nPasswordAuthentication no' >> /etc/ssh/sshd_config
echo '\n[sshd]\n enabled = true\n port = 9622' >> /etc/fail2ban/jail.d/ssh.conf
echo '' > /etc/motd
systemctl reload sshd
systemctl reload fail2ban

# docker and logging
# journal
tee -a /etc/docker/daemon.json << END
{
  "log-driver": "local",
  "log-opts": {
    "max-size": "10m"
    "max-file": 10
  }
}
END

sed -i 's/#Storage.*/Storage=persistent/' /etc/systemd/journald.conf
sed -i 's/#SystemMaxUse=.*/SystemMaxUse=2G/' /etc/systemd/journald.conf
killall -USR1 systemd-journald
