MY=https://raw.githubusercontent.com/manhg/snippets/master

# basic tools
curl $MY/bashrc > ~/.bashrc
echo 'source .bashrc' >> .bash_profile
apt-get update
apt-get install bash-completion curl git docker.io postfix psmisc fail2ban gnupg logcheck rsync python3-pip

tee -a /etc/ssh/sshd_config.d/custom.conf << END
Port = 9622
PasswordAuthentication no
END

tee -a  /etc/fail2ban/jail.d/ssh.conf << END
[sshd]
enabled = true
port = 9622
END

echo '' > /etc/motd
systemctl reload sshd
systemctl reload fail2ban

timedatectl set-timezone Asia/Tokyo

# docker and logging
# journal
tee -a /etc/docker/daemon.json << END
{
  "log-driver": "local",
  "log-opts": {
    "max-size": "10m",
    "max-file": 100
  }
}
END
systemctl restart docker
pip install docker-compose

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
