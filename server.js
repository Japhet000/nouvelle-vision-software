import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();

app.use(express.json({ limit: '100kb' }));

// Configuration CORS
const origins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(x => x.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin || !origins.length || origins.includes(origin)) {
      return cb(null, true);
    }

    cb(new Error('Origin not allowed'));
  }
}));

// Connexion Supabase
const db = (
  process.env.SUPABASE_URL &&
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
  ? createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false
        }
      }
    )
  : null;

// Vérification du serveur
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'Nouvelle Vision Software API',
    databaseConfigured: !!db
  });
});

// Récupération des logiciels
app.get('/api/products', async (_req, res) => {

  if (!db) {
    return res.status(503).json({
      error: 'Database is not configured'
    });
  }

  try {
    const { data, error } = await db
      .from('products')
      .select(`
        id,
        name,
        description,
        category,
        icon,
        monthly_price_cents,
        license_price_cents
      `)
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('SUPABASE ERROR:', error);

      return res.status(500).json({
        error: 'Impossible de charger les produits',
        details: error.message
      });
    }

    res.json({
      products: data || []
    });

  } catch (error) {
    console.error('SERVER ERROR:', error);

    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`NV API started on port ${PORT}`);
});
