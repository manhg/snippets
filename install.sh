MY=https://raw.githubusercontent.com/manhg/snippets/master

# basic tools
curl $MY/bashrc > ~/.bashrc
echo 'source .bashrc' >> .bash_profile
apt-get update
apt-get install bash-completion curl git docker.io postfix psmisc fail2ban gnupg logcheck rsync python3-pip libffi-dev
echo '' > /etc/motd
timedatectl set-timezone Asia/Tokyo
pip3 install docker-compose

sed -i 's/#Storage.*/Storage=persistent/' /etc/systemd/journald.conf
sed -i 's/#SystemMaxUse=.*/SystemMaxUse=2G/' /etc/systemd/journald.conf
killall -USR1 systemd-journald

# firewall
apt-get install ufw
ufw allow 3389
ufw allow 9622
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable


mkdir /etc/ssh/sshd_config.d
tee -a /etc/ssh/sshd_config << END
    Port 9622
    PasswordAuthentication no
END

tee -a  /etc/fail2ban/jail.d/ssh.conf << END
[sshd]
enabled = true
port = 9622
END

systemctl reload sshd
systemctl reload fail2ban

cd /usr/bin
curl https://getmic.ro/r | sudo sh
