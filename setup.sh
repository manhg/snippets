timedatectl set-timezone Asia/Tokyo

apt-get update
apt-get install -y \
    bash-completion curl rsync net-tools \
    certbot git docker-compose postfix \
    psmisc fail2ban gnupg logcheck libffi-dev \
    python3-venv python3-pip python3-openssl python3-psycopg2 postgresql-client python3-dotenv rclone \
    ufw net-tools

echo '' > /etc/motd

tee -a /etc/systemd/journald.conf << END
Storage=persistent
Compress=yes
MaxRetentionSec=6month
MaxFileSec=6month
MaxLevelStore=info
SystemMaxUse=5G
END

tee -a /root/renew_ssl.sh << END
#!/bin/bash
certbot renew --noninteractive
nginx -t && nginx -s reload
END

tee -a /root/cron.sh << END
MAILTO=alert@giang.biz
PATH=/bin:/usr/bin:/usr/sbin:/usr/local/bin

0 1 * * 0 /root/renew_ssl.sh > /dev/null
0 * * * * /bin/bash /root/check_disk.sh /dev/sda > /dev/null
END

tee /root/check_disk.sh << END
#!/bin/bash
CURRENT=$(df $1 | grep / | awk '{ print $5}' | sed 's/%//g')
THRESHOLD=80
if [ "$CURRENT" -gt "$THRESHOLD" ] ; then
    echo "WARNING Disk space full soon "
    hostname
    df -hT -t ext4
fi
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

tee /etc/profile << END
    # If not running interactively, don't do anything
    [[ $- != *i* ]] && return

    # lift history limit
    export HISTFILE=~/.bash_history
    shopt -s histappend
    export HISTCONTROL=ignorespace
    export PROMPT_COMMAND="history -a; history -n; ${PROMPT_COMMAND}"
    export HISTTIMEFORMAT="%y-%m-%d %T "
    export HISTSIZE=100000

    export LC_ALL=en_US.UTF-8
    export LANG=en_US.UTF-8
    export PYTHONIOENCODING=utf-8
    export PYTHONUNBUFFERED=1
    export PYTHONWARNINGS="ignore:Deprecation"
    export JAVA_OPTS="-Xms32m -Xmx256m"
    export JVM_OPTS=$JAVA_OPTS

    alias l='ls --color=auto --classify --group-directories-first --human-readable --quoting-style=literal'
    alias l.='ls -d .* --color=auto' # show hidden only
    alias ll='l -la' # show all
    alias rand='dd if=/dev/urandom bs=128 count=1 2>/dev/null | base64 | cut -c -16 | head -n 1'
    alias du1='du -h --max-depth=1'
    alias ip4='ip a|grep "inet "'
    alias ip6='ip a|grep "inet6 "'
    alias du10='du --max-depth=1 | sort -n -r | head -n 10'

    PS_COLOR="\[$(tput setaf 3)\]"
    RESET="\[$(tput sgr0)\]"
    export PS1="${PS_COLOR}\u@\h \w \$ ${RESET}"
END

tee -a /etc/docker/daemon.json << END
{"log-driver": "journald","iptables": false,"userland-proxy": true}
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

sudo fallocate -l 3G /swapfile && chmod 600 /swapfile && mkswap /swapfile && echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab | swapon /swapfile
useradd app
useradd app --groups sudo,adm
mkdir -p /home/app/.ssh && chown owner /home/app && chmod 700 /app/owner
