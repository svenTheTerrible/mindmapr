FROM node:18.7.0
ENV NODE_OPTIONS="--openssl-legacy-provider" 
WORKDIR /mindmapr
COPY . .
RUN npm install
CMD ["npm", "run", "storybook"]
