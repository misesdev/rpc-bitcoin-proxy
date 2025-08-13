
# proxy/Dockerfile
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install
# --only=production

# Copiar código
COPY . .

# Compilar TypeScript para JS
RUN npm install -g typescript \
    && tsc

# Expor porta do proxy
EXPOSE 8081

# Comando de inicialização
CMD ["node", "dist/index.js"]
