
FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "example.js"]  # Replace "example.js" with the name of your main Node.js file
