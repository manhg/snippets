MY=https://raw.githubusercontent.com/manhg/snippets/master

# basic tools
curl $MY/bashrc > ~/.bashrc
echo 'source .bashrc' >> .bash_profile
apt-get update
apt-get install -y bash-completion curl rsync \
    certbot git docker-compose postfix \
    psmisc fail2ban gnupg logcheck libffi-dev\
    python3-pip python3-venv python3-openssl python3-psycopg2 python3-dotenv

echo '' > /etc/motd
timedatectl set-timezone Asia/Tokyo

tee -a /etc/systemd/journald.conf << END
    Storage=persistent
    Compress=yes
    MaxRetentionSec=6month
    MaxFileSec=6month
    MaxLevelStore=info
    SystemMaxUse=5G
END

cd /root && wget https://raw.githubusercontent.com/manhg/snippets/master/check_disk.sh

tee -a /root/cron.sh << END
#!/bin/bash
certbot renew --noninteractive
nginx -t && nginx -s reload
END

crontab -l > /root/cron.sh
tee -a /root/cron.sh << END
MAILTO=alert@giang.biz
PATH=/bin:/usr/bin:/usr/sbin:/usr/local/bin

0 1 * * 0 /root/renew_ssl.sh > /dev/null
0 * * * * /bin/bash /root/check_disk.sh /dev/sda > /dev/null
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
ufw default allow routed # comment "for docker routes"
ufw enable

tee -a /etc/docker/daemon.json << END
{"log-driver": "journald", "iptables": false,"userland-proxy": true}
END

tee -a /etc/ssh/sshd_config << END
    Port 9622
    PasswordAuthentication no
END

tee -a /etc/sysctl.d/tune.conf << END
    fs.file-max = 2097152
    vm.swappiness = 10
    vm.vfs_cache_pressure=50
    # ensure Docker network access
    net.ipv4.ip_forward=1
    net.ipv6.conf.all.forwarding=1
END
sysctl --system

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

sudo fallocate -l 3G /swapfile && chmod 600 /swapfile && mkswap /swapfile && echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab | swapon /swapfile
