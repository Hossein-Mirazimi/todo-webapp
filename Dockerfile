# Stage 1: Install dependencies for the client
FROM node:18.20.5-alpine3.20 AS client-installer

WORKDIR /client-installer

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY package.json  ./

COPY website/package.json /client-installer/website/package.json

RUN pnpm install --frozen-lockfile

# Stage 2: Build the client
FROM node:18.20.5-alpine3.20 AS client-builder

WORKDIR /client-builder

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=client-installer /client-installer/ ./
COPY website website

RUN pnpm --filter @app/website build

# Stage 3: Install dependencies for the server
FROM node:18.20.5-alpine3.20 AS server-installer

WORKDIR /server-installer

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY package.json  ./

COPY server/package.json /server-installer/server/package.json

RUN pnpm install --frozen-lockfile

# Stage 4: Build the server
FROM node:18.20.5-alpine3.20 AS server-builder

WORKDIR /server-builder

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY package.json  ./

COPY server server
COPY --from=server-installer /server-installer/server/node_modules server/node_modules
COPY routeRules.ts routeRules.ts

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @app/server build

# Stage 5: Run the application
FROM node:18.20.5-alpine3.20 AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY package.json  ./

COPY --from=client-builder /client-builder/website/package.json website/package.json
COPY --from=client-builder /client-builder/website/dist website/dist
COPY --from=server-builder /server-builder/server/node_modules server/node_modules
COPY --from=server-builder /server-builder/server/dist server/dist
COPY --from=server-builder /server-builder/server/package.json server/package.json

RUN pnpm install --prod --frozen-lockfile

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "./server/dist/server/index.js"]