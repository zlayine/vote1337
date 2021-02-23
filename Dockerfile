FROM node:10-alpine

RUN apk --no-cache add shadow \                                                                   
    gcc \                                                                                         
    musl-dev \                                                                                    
    autoconf \                                                                                    
    automake \                                                                                    
    make \                                                                                        
    libtool \                                                                                     
    nasm \                                                                                        
    tiff \                                                                                        
    jpeg \                                                                                        
    zlib \                                                                                        
    zlib-dev \                                                                                    
    file \                                                                                        
    pkgconf \
	sudo

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN echo root:RoAot321 | /usr/sbin/chpasswd

USER node

RUN npm install

COPY --chown=node:node . .

# RUN usermod -u 1004 node

# RUN sudo groupmod -g 1001 node && usermod -u 1001 -g 1001 node

EXPOSE 3000

CMD [ "npm", "start" ]