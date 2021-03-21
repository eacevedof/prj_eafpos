FROM alpine:latest

RUN apk add mysql-client

ENV ENV="/root/.bashrc"
RUN echo "alias ll='ls -la'" >> /root/.bashrc
RUN echo "alias home='cd $HOME'" >> /root/.bashrc
RUN echo "alias appdata='cd /appdata'" >> /root/.bashrc
RUN echo "alias ioin='cd /appdata/io/in'" >> /root/.bashrc
RUN echo "alias ioout='cd /appdata/io/out'" >> /root/.bashrc
RUN echo "alias scripts='cd /appdata/scripts'" >> /root/.bashrc
RUN echo "0 */8 * * * /bin/sh /appdata/scripts/backup-cron.sh" | crontab -

#arranca el servicio y lo deja en modo foreground
CMD ["crond", "-f"]