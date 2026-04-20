# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Arguments needed at build time for Next.js frontend
ARG NEXT_PUBLIC_apiKey
ARG NEXT_PUBLIC_authDomain
ARG NEXT_PUBLIC_projectId
ARG NEXT_PUBLIC_storageBucket
ARG NEXT_PUBLIC_messagingSenderId
ARG NEXT_PUBLIC_appId
ARG NEXT_PUBLIC_measurementId

# Set Envs for the 'next build' process
ENV NEXT_PUBLIC_apiKey=$NEXT_PUBLIC_apiKey
ENV NEXT_PUBLIC_authDomain=$NEXT_PUBLIC_authDomain
ENV NEXT_PUBLIC_projectId=$NEXT_PUBLIC_projectId
ENV NEXT_PUBLIC_storageBucket=$NEXT_PUBLIC_storageBucket
ENV NEXT_PUBLIC_messagingSenderId=$NEXT_PUBLIC_messagingSenderId
ENV NEXT_PUBLIC_appId=$NEXT_PUBLIC_appId
ENV NEXT_PUBLIC_measurementId=$NEXT_PUBLIC_measurementId

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# We only copy the necessary build output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]