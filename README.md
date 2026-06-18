# 🎺 TWONPET HAÏTI — Déploiement Render

## Structure
```
Twonpet/
├── server.js          # Backend Node.js + Socket.io
├── package.json
├── render.yaml        # Config déploiement Render
└── public/
    └── index.html     # Frontend complet
```

## Déploiement sur Render (gratuit)

### Étape 1 — Mettre sur GitHub
1. Crée un repo GitHub (ex: `Twonpet`)
2. Upload les fichiers du dossier `Twonpet/`
3. Push sur la branche `main`

### Étape 2 — Déployer sur Render
1. Va sur https://render.com et crée un compte gratuit
2. Clique **"New +"** → **"Web Service"**
3. Connecte ton repo GitHub
4. Render détecte automatiquement `render.yaml`
5. Clique **"Deploy"** — c'est tout!

### Étape 3 — Partager
- Render te donne une URL comme `https://Twonpet.onrender.com`
- Partage ce lien sur WhatsApp, TikTok, Instagram
- Tout le monde peut l'ouvrir direct depuis leur téléphone

## Features
- 🎺 Bouton Twonpet (appuie et maintiens)
- 📯 4 sons : Twonpet, Klaxon, Tambou, Chant Haïti
- 🎙️ Mode DJ : crée une room, broadcast le son vers tous les téléphones connectés
- 🎧 Mode Listener : rejoins une room avec un code
- 🇭🇹 Design couleurs Haïti

## Test local
```bash
npm install
npm start
# Ouvre http://localhost:3000
```
