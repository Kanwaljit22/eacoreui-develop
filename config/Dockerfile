FROM containers.cisco.com/it_cvc_cisco_commerce/nginx:1.19

USER root

RUN rm -rf /usr/share/nginx/html/*

RUN mkdir -p /var/log/nginx

RUN mkdir -p /usr/share/nginx/html/app

COPY app /usr/share/nginx/html

COPY webapp /usr/share/nginx/html/

RUN chmod -R 777 /usr/share/nginx/html/init.html

COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY mime.types /etc/nginx/mime.types

RUN chgrp -R root /var/cache/nginx /var/run /var/log/nginx /etc/nginx/ && \
    chmod -R 770 /var/cache/nginx /var/run /var/log/nginx /etc/nginx/


CMD envsubst '${COLOR} ${CISCO_ENV} ${CISCO_LIFE} ${CISCO_BGCOLOR} ${CISCO_DCNAME}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;' || cat /etc/nginx/nginx.conf
