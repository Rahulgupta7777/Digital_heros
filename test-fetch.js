const start = Date.now();
fetch('https://qlkqrraamjlfnfyfcakx.supabase.co/rest/v1/')
  .then(res => {
    console.log('Status:', res.status);
    console.log('Time:', Date.now() - start, 'ms');
  })
  .catch(err => {
    console.error('Fetch error:', err.message);
    console.log('Time:', Date.now() - start, 'ms');
  });
