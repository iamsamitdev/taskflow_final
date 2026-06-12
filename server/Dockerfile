# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (รวม devDependencies สำหรับ build)
RUN pnpm install --frozen-lockfile

# Copy source code + prisma schema
COPY . .

# Generate Prisma Client
RUN pnpm exec prisma generate

# Compile TypeScript
RUN pnpm build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built output
COPY --from=builder /app/dist ./dist

# Copy Prisma schema + generated client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma

EXPOSE 3000

# รัน migrate แล้ว start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
