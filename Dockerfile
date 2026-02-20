FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código
COPY . .

# Exponer puerto
EXPOSE 3001


# Comando de inicio
CMD ["npm", "start"]
