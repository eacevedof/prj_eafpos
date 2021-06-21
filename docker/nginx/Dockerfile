FROM nginx:latest

RUN echo "alias ll='ls -la'" >> /root/.bashrc
RUN echo "alias home='cd $HOME'" >> /root/.bashrc
RUN echo "alias appdata='cd /appdata'" >> /root/.bashrc
RUN echo "alias ioin='cd /appdata/io/in'" >> /root/.bashrc
RUN echo "alias ioout='cd /appdata/io/out'" >> /root/.bashrc
RUN echo "alias conf='cd /etc/nginx/conf.d'" >> /root/.bashrc


# COPY ./certs/*.crt /etc/ssl/certs/
# COPY ./certs/*.key /etc/ssl/private/

WORKDIR /appdata/www