# Stage 1: Build React
FROM node:20 AS builder
WORKDIR /app

# Copy package files & install
COPY package*.json ./
RUN npm install --force

# Copy source
COPY . .

# Pass environment variables from Docker Compose build
# ARG VITE_CLERK_PUBLISHABLE_KEY
# ARG VITE_IMAGE_KIT_ENDPOINT
# ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
# ENV VITE_IMAGE_KIT_ENDPOINT=$VITE_IMAGE_KIT_ENDPOINT
# ARG VITE_IMAGE_KIT_PUBLIC_KEY
# ENV VITE_IMAGE_KIT_PUBLIC_KEY=$VITE_IMAGE_KIT_PUBLIC_KEY
# ARG CHAT_GPT_KEY
# ENV CHAT_GPT_KEY=$CHAT_GPT_KEY

# Build React app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
