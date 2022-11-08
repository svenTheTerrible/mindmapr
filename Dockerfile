#build JS
FROM node:18.7.0 as frontend-builder
ENV NODE_OPTIONS="--openssl-legacy-provider" 
WORKDIR /mindmapr
COPY . .
RUN npm install && npm run build-storybook

#static python file server
FROM python:latest
WORKDIR /mindmapr
COPY --from=frontend-builder /mindmapr/storybook-static .
CMD ["python", "-m", "http.server"]