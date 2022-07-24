FROM node:latest
RUN git clone https://github.com/vbxngvklfhgikklvfsvrfundfnosdif/sgvregydxzfs /root/queendianamd
WORKDIR /root/queendianamd
ENV TZ=Asia/Colombo
RUN npm install supervisor -g
RUN yarn install --no-audit

CMD ["node", "main.js"]
