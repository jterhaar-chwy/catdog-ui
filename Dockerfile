FROM node:18

WORKDIR /app

# Set up authentication for private registry
ARG YARN_NPM_AUTH_TOKEN
ENV YARN_NPM_AUTH_TOKEN=$YARN_NPM_AUTH_TOKEN

# Enable Yarn 3.x (corepack)
RUN corepack enable

# Copy package files
COPY .yarnrc.yml ./
COPY package.json ./
COPY yarn.lock ./
COPY .yarn/releases ./.yarn/releases

# Install dependencies
RUN yarn install --immutable

# Copy source code
COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]
