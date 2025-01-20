FROM node:16-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package.json package-lock.json* ./

# Installer les dépendances
RUN npm install

# Copier tout le projet dans le conteneur
COPY . .

# Construire le projet (pour TypeScript et production)
RUN npm run build

# Exposer le port par défaut de Next.js
EXPOSE 3000

# Lancer le serveur Next.js en production
CMD ["npm", "run", "start"]
