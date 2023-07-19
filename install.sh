MY=https://raw.githubusercontent.com/manhg/snippets/master

# basic tools
curl $MY/bashrc > ~/.bashrc
echo 'source .bashrc' >> .bash_profile
apt-get update
apt-get install -y bash-completion curl git docker.io postfix psmisc fail2ban gnupg logcheck rsync python3-pip libffi-dev
echo '' > /etc/motd
timedatectl set-timezone Asia/Tokyo
pip3 install docker-compose

tee -a /etc/systemd/journald.conf << END
    Storage=persistent
    Compress=yes
    MaxRetentionSec=6month
    MaxFileSec=6month
    MaxLevelStore=info
    SystemMaxUse=2G
END

cd /root && wget https://raw.githubusercontent.com/manhg/snippets/master/check_disk.sh

crontab -l > /root/cron.sh
tee -a /root/cron.sh << END
0 * * * * /bin/bash /root/check_disk.sh /dev/sda
END
crontab /root/cron.sh

killall -USR1 systemd-journald



# firewall
apt-get install ufw
ufw allow 3389
ufw allow 9622
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable

tee -a /etc/docker/daemon.json << END
{"log-driver": "journald"}
END

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
systemctl restart docker

cd /usr/bin
curl https://getmic.ro/r | sudo sh
