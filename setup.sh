timedatectl set-timezone Asia/Tokyo

apt-get update
apt-get install -y \
    bash-completion curl net-tools certbot git  \
    docker.io docker-compose \
    psmisc fail2ban gnupg libffi-dev \
    python3-venv python3-pip python3-openssl python3-psycopg2 postgresql-client python3-dotenv \
    ufw rclone rsync postfix rsyslog-gnutls
echo '' > /etc/motd

tee -a /etc/systemd/journald.conf << END
Storage=persistent
Compress=yes
MaxRetentionSec=6month
MaxFileSec=6month
MaxLevelStore=info
SystemMaxUse=5G
ForwardToSyslog=Yes
END

tee -a /root/renew_ssl.sh << END
#!/bin/bash
certbot renew --noninteractive
nginx -t && nginx -s reload
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
ufw logging low
ufw enable

wget https://raw.githubusercontent.com/manhg/snippets/refs/heads/master/bashrc
mv bashrc ~/.bashrc
wget https://raw.githubusercontent.com/manhg/snippets/refs/heads/master/check_disk.sh

tee -a /root/cron.sh << END
MAILTO=alert@giang.biz
PATH=/bin:/usr/bin:/usr/sbin:/usr/local/bin

0 1 * * 0 /root/renew_ssl.sh > /dev/null
0 * * * * /bin/bash /root/check_disk.sh /dev/sda > /dev/null
END

tee -a /etc/docker/daemon.json << END
{"log-driver": "journald",
"iptables": false,
"userland-proxy": true,
"ipv6": true,
"fixed-cidr-v6": "64:ff9b:1::/48"}
END

tee -a /etc/ssh/sshd_config << END
Port 9622
PasswordAuthentication no
ListenAddress ::
END

tee -a /etc/sysctl.d/tune.conf << END

fs.file-max = 2097152

# do less swap
vm.swappiness = 5
vm.vfs_cache_pressure=50
vm.dirty_background_ratio = 2

net.ipv6.conf.default.router_solicitations = 0

# decrease latency
net.core.rmem_max = 8388608
net.core.wmem_max = 8388608
net.core.netdev_max_backlog = 5000

net.ipv4.tcp_rmem = 4096 87380 33554432
net.ipv4.tcp_wmem = 4096 65536 33554432
net.ipv4.tcp_window_scaling = 1
net.ipv4.tcp_no_metrics_save = 1

kernel.pid_max = 65536
net.ipv4.ip_local_port_range=1024 65535
net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
net.ipv4.tcp_syncookies=1

net.ipv4.tcp_keepalive_time = 120

net.core.somaxconn = 256000
net.ipv4.tcp_congestion_control = yeah
net.core.default_qdisc = fq_codel

# https://community.rti.com/kb/how-can-i-improve-my-throughput-performance-linux
net.ipv4.ipfrag_high_thresh=8388608
net.ipv4.ipfrag_low_thresh=196608
net.ipv6.ip6frag_high_thresh=8388608
net.ipv6.ip6frag_low_thresh=196608

# http://www.opennet.ru/opennews/art.shtml?num=50889
net.ipv4.tcp_sack = 0
net.ipv4.tcp_mtu_probing = 0

# Prevent TIME_WAIT attak.
net.ipv4.tcp_rfc1337 = 1
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
export EDITOR=micro

sudo fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab | swapon /swapfile

wget -O /usr/local/bin/dry https://github.com/moncho/dry/releases/download/v0.11.1/dry-linux-amd64
chmod 755 /usr/local/bin/dry
