FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["sh", "-c", "npx prisma generate --schema ./prisma/schema && npx prisma migrate deploy --schema ./prisma/schema && npm run dev"]
