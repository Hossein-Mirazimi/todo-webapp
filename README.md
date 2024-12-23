# Todo Webapp Monorepo

[![CI](https://github.com/Hossein-Mirazimi/todo-webapp/actions/workflows/ci.yaml/badge.svg)](https://github.com/Hossein-Mirazimi/todo-webapp/actions/workflows/ci.yaml)

This monorepo project includes both a server and a website application built with Vue 3, TypeScript, and Vite. The project leverages modern web development features such as SSR (Server-Side Rendering), ISR (Incremental Static Regeneration), Docker, Docker Compose, and Kubernetes deployment configurations.

## Project Structure

- **Server**: Located in the `server` directory, built with Node.js and Express.
- **Website**: Located in the `website` directory, built with Vue 3 and Vite.
todo-webapp/
├── .github/
│   └── workflows/
│       └── ci.yaml
├── server/
│   ├── handlers/
│   │   ├── isrHandler.ts
│   │   ├── ssrHandler.ts
│   │   ├── spaHandler.ts
│   │   └── renderRouter.ts
│   ├── middlewares/
│   │   ├── dev.ts
│   │   ├── prod.ts
│   │   ├── index.ts
│   │   ├── routeRules.ts
│   │   └── error.ts
│   ├── models/
│   │   └── exampleModel.ts
│   ├── routes/
│   │   └── exampleRoute.ts
│   ├── services/
│   │   └── exampleService.ts
│   ├── utils/
│   │   ├── cacheManager.ts
│   │   ├── logger.ts
│   │   ├── path.ts
│   │   ├── routeMetaManager.ts
│   │   └── template.ts
│   ├── index.ts
│   ├── global.d.ts
│   ├── add-extension.js
│   ├── package.json
│   └── tsconfig.json
├── website/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── endpoint.ts
│   │   │   └── index.ts
│   │   ├── assets/
│   │   │   ├── icons
│   │   │   │   ├── icon-check.svg
│   │   │   │   └── icon-cross.svg
│   │   │   └── vue.svg
│   │   ├── components/
│   │   │   ├── common
│   │   │   │   └── ClientOnly.vue
│   │   │   ├── layout
│   │   │   │   └── AppHeader.vue
│   │   │   ├── ui
│   │   │   │   ├── CheckBox.vue
│   │   │   │   └── Container.vue
│   │   │   └── todo
│   │   │       ├── Filter.vue
│   │   │       ├── Form.vue
│   │   │       ├── Todo.vue
│   │   │       ├── TodoItem.vue
│   │   │       └── TodoLists.vue
│   │   ├── composables/
│   │   │   ├── useProviderInject.ts
│   │   │   └── useTodoList.ts
│   │   ├── pages/
│   │   │   ├── [...all].vue
│   │   │   ├── index.vue
│   │   │   ├── isr.vue
│   │   │   └── spa.vue
│   │   ├── plugins/
│   │   │   └── ssr-context
│   │   │       ├── index.ts
│   │   │       └── useAsyncData.ts
│   │   ├── types/
│   │   │   ├── index.ts
│   │   │   ├── todo.ts
│   │   │   └── utility.ts
│   │   ├── utils/
│   │   │   ├── generator.ts
│   │   │   ├── error.ts
│   │   │   └── index.ts
│   │   ├── App.vue
│   │   ├── main.ts
│   │   ├── entry-client.ts
│   │   ├── entry-server.ts
│   │   ├── vite-env.d.ts
│   │   └── style.css
│   ├── public/
│   │   ├── vite.svg
│   │   ├── robot.txt
│   │   └── icons
│   │       ├── icon-48x48.png
│   │       └── ...
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── deployment.yaml
├── .dockerignore
├── .gitignore
├── README.md
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── package.json
└── .npmrc
└── routeRules.ts
└── tsconfig.json
## Features

- **Monorepo**: Managed with `pnpm` for efficient dependency management.
- **SSR (Server-Side Rendering)**: Dynamic SSR configuration per page.
- **ISR (Incremental Static Regeneration)**: Implement invalidate ISR per page.
- **Docker**: Dockerfile for building and running the application.
- **Docker Compose**: Configuration for networking and replica setup.
- **Kubernetes**: Deployment configuration for Kubernetes.
- **Route Rules**: Custom route rules per route.
- **TypeScript**: Strongly typed codebase for both server and website.
- **Express**: Server built with Express for handling API requests.
- **GitHub Actions (CI)**: Continuous Integration setup with GitHub Actions.

## Getting Started

### Prerequisites

- Node.js 18.x
- pnpm
- Docker
- Docker Compose
- Kubernetes (optional for deployment)

### Installation

1. Clone the repository:
```sh
git clone https://github.com/Hossein-Mirazimi/todo-webapp.git
cd todo-webapp
```
2. Install dependencies:
```sh
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
```

### Running the Application

#### Using Docker Compose

1. Build and start the services:
```sh
docker-compose up --build
```
2. Access the website at http://localhost:3000.

#### Using Kubernetes

1. Apply the Kubernetes deployment configuration:
```sh
kubectl apply -f k8s/deployment.yaml
```

2. Access the services as per your Kubernetes setup.

#### Using Minikube

1. Start Minikube:
```sh
minikube start
```

2. Build Docker images inside Minikube:
```sh
eval $(minikube docker-env)
docker build -t todo-app-website -f .
```
3. Enable Ingress addons
```sh
minikube addons enable ingress
```

4. Apply the Kubernetes deployment configuration:
```sh
kubectl apply -f k8s/deployment.yaml
```

5. minikube service list
```sh
minikube service list
```

6. Open the service URLs in your browser `my-app.local`
```sh
minikube tunnel 
```

#### Deployment

1. Start the development server:

```sh
pnpm run dev
```