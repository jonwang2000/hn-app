FROM node:11

WORKDIR /home/node

COPY --chown=node:node package.json yarn.lock /home/node/
RUN apt-get update
RUN apt-get install python python-pip -y
RUN pip install scikit-image pydicom opencv-python
RUN apt-get install python3 python3-pip -y
RUN pip3 install scikit-image pydicom opencv-python numpy Pillow==5.3.0 scipy==1.01 matplotlib torchvision torch

USER node
RUN yarn install

ENV PORT=8000 UPLOAD_ROOT=/home/node/uploads

COPY --chown=node:node . /home/node

VOLUME $UPLOAD_ROOT

USER node
EXPOSE $PORT

CMD [ "node", "src/index.js" ]
