FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Prevent MongoDB error during build
# This gives Next.js a fake placeholder JUST to complete the build
ENV MONGODB_URI="placeholder"

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
