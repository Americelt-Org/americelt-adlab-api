FROM node:22

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3001

CMD ["sh", "-c", "npx prisma generate --schema ./prisma/schema && npx prisma migrate deploy --schema ./prisma/schema && npm run build"]
