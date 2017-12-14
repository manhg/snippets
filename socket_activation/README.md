### Stucture

```
                     +----- On demand -----+
Client -> Socket <-- |  -> Proxy <-> App   |
                     +---------------------+
```

* Access port 9901 will forward to application on port 9001

```
# enbable systemd instance for user
loginctl enable-linger user

# NOTE must login directly, not via su
# ssh user@host
systemctl --user daemon-reload
systemctl --user start auto_active@01.socket

# persist next reboot
systemctl --user enable auto_active@02.socket 
``` 