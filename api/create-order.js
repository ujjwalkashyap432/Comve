export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, receipt } = req.body;

  const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_Tr6eYjC4PcMajn";
  const keySecret = process.env.RAZORPAY_KEY_SECRET || "egJDfvWw2rBNeIsr63bmXINx";
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  try {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: Math.round(Number(amount)),
        currency: 'INR',
        receipt: receipt || `rcpt_${Date.now()}`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
