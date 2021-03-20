FROM alpine:latest

RUN apk add mysql-client
RUN echo "* * * * * echo $(date) hello >> /appdata/scripts/cron.log" | crontab -
CMD ["crond","-f"]