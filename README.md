# 🧪 AI Visual Lab

Interactive visualizations to understand how AI works — built with React + Vite.

## Structure

```
src/
├── App.jsx                         ← Router
├── main.jsx                        ← Entry point
├── index.css                       ← Global styles
├── components/
│   └── NavBar.jsx                  ← Shared navigation
└── pages/
    ├── Home.jsx                    ← Landing page (all visualizations)
    └── TokenOptimization.jsx       ← Visualization #1
```

## Adding a New Visualization

1. Create `src/pages/YourTopic.jsx`
2. Add a route in `src/App.jsx`:
   ```jsx
   <Route path="/your-topic" element={<YourTopic />} />
   ```
3. Add a card in `src/pages/Home.jsx` in the `VISUALIZATIONS` array with `ready: true`

## Local Development

```bash
npm install
npm run dev
```

## Deploy

```bash
npx vercel deploy
```

Or just push to GitHub — Vercel auto-deploys on every commit.
