# docker ce
if [ ! `command -v docker` ];then

  echo 'Install docker...'
  
  if [ -n "$(command -v apt)" ];then  
    sudo apt install -y docker.io
  else 
    sudo yum install -y yum-utils device-mapper-persistent-data lvm2
    sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    sudo yum makecache fast
    sudo yum install docker-ce -y
  fi

  echo "install docker-compose"
  sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose

  sudo systemctl start docker
  sudo systemctl enable docker
else 
  docker --version 
fi