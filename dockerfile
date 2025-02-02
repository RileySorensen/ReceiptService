FROM node:16
COPY . .
RUN npm install
ENV PORT=3000
EXPOSE 3000

CMD ["npm","start"]