# sample
#
# Host tunnel-alias.local
#     HostName tunnel_host
#     IdentityFile ~/tunnel_private_key.pem
#     User tunnel_user
#     LocalForward local_port target_server:target_port

# to open tunnel, just use `ssh -fN tunnel-alias.local`