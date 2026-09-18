FROM node:24-bookworm-slim
WORKDIR /app
COPY . .
RUN npm run build
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4173 DATA_DIR=/data
EXPOSE 4173
CMD ["npm","start"]
