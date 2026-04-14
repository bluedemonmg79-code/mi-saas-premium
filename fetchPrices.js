import fs from 'fs';

async function fetchStripePrices() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  let stripeKey = '';
  
  const match = envFile.match(/STRIPE_SECRET_KEY=["']?([^"'\r\n]+)["']?/);
  if (match) stripeKey = match[1].trim();

  if (!stripeKey) {
    console.error("No se encontró STRIPE_SECRET_KEY en .env.local");
    return;
  }

  const res = await fetch('https://api.stripe.com/v1/prices?active=true&expand[]=data.product', {
    headers: { 'Authorization': `Bearer ${stripeKey}` }
  });
  
  const data = await res.json();
  const prices = data.data.map(p => ({
    product_name: p.product.name,
    price_id: p.id,
    unit_amount: (p.unit_amount / 100) + ' ' + p.currency.toUpperCase()
  }));

  console.log(JSON.stringify(prices, null, 2));
}

fetchStripePrices();
