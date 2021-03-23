FROM mariadb:10.5.9

ARG DB_USER
ARG DB_PASSWORD

RUN echo "alias ll='ls -la'" >> /root/.bashrc
RUN echo "alias home='cd $HOME'" >> /root/.bashrc
RUN echo "alias appdata='cd /appdata'" >> /root/.bashrc
RUN echo "alias ioin='cd /appdata/io/in'" >> /root/.bashrc
RUN echo "alias ioout='cd /appdata/io/out'" >> /root/.bashrc

RUN echo "alias scripts='cd /appdata/scripts'" >> /root/.bashrc
RUN echo "alias db='mysql --host=localhost --user=$DB_USER --password=$DB_PASSWORD'" >> /root/.bashrc

RUN apt-get update \
    && apt-get -y install --no-install-recommends vim

WORKDIR /appdata