FROM node:18-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances nécessaires
RUN npm install

# Copier tous les fichiers du projet dans le conteneur
COPY . .

# Compiler le projet TypeScript en JavaScript
RUN npx tsc

# Définir la commande par défaut pour exécuter le producteur
CMD ["node", "dist/producer.js"]
