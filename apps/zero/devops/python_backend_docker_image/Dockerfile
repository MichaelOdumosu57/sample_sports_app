FROM python:3.11.0


RUN apt-get -y update && DEBIAN_FRONTEND=noninteractive \
    apt-get  -y install  curl gnupg2 git ssh tar gzip ca-certificates lsb-release \
    # python
    g++ gcc autoconf automake bison libc6-dev libffi-dev \
    libgdbm-dev libncurses5-dev libsqlite3-dev libtool libyaml-dev \
    make pkg-config sqlite3 zlib1g-dev libgmp-dev libreadline-dev libssl-dev unixodbc-dev  \
    # ruby
    wget software-properties-common \
    #circle ci additions \
    unzip jq \
    # e2e additions
    xorg xauth openbox sudo \
    # dev additions
    mlocate vim dos2unix tmux





# Install OpenSSH and set the password for root to "Docker!". In this example, "apk add" is the install instruction for an Alpine Linux-based image.
RUN apt-get -y install  openssh-server \
     && echo "root:Docker!" | chpasswd

# Copy the sshd_config file to the /etc/ssh/ directory
COPY sshd_config /etc/ssh/
COPY ssh_config  /etc/ssh/
COPY id_ed25519  /root/.ssh/id_ed25519
COPY known_hosts  /root/.ssh/known_hosts
RUN  chmod 400 /root/.ssh/id_ed25519 \
    && dos2unix /root/.ssh/id_ed25519
RUN  chmod 644 /root/.ssh/known_hosts \
    && dos2unix /root/.ssh/known_hosts

# Copy and configure the ssh_setup file
RUN mkdir -p /tmp
COPY ssh_setup.sh /tmp
RUN chmod +x /tmp/ssh_setup.sh \
    && (sleep 1;/tmp/ssh_setup.sh 2>&1 > /dev/null)

# Open port 2222 for SSH access
EXPOSE 80 2222


# startup script
COPY init.sh /usr/local/bin/
RUN chmod u+x /usr/local/bin/init.sh

# add odbc driver  Microsoft ODBC 17
# rmbr to check the  image against lsb_release -rs and update as necessary
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get -y update && ACCEPT_EULA=Y apt-get install -y msodbcsql17 mssql-tools libgssapi-krb5-2



ENTRYPOINT [ "init.sh" ]


