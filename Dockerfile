FROM 278833423079.dkr.ecr.us-east-1.amazonaws.com/plat/plat/nodejs-baseimg:20

WORKDIR /app

# Copy Yarn configuration and package files
COPY .yarnrc.yml ./
COPY package.json ./
COPY yarn.lock ./
COPY .yarn ./.yarn

# Set up authentication for private registry
ARG YARN_NPM_AUTH_TOKEN
ENV YARN_NPM_AUTH_TOKEN=$YARN_NPM_AUTH_TOKEN

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]
