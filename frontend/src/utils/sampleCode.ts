export const sampleCode = `async function transferFunds(user, amount) {
  const balance = await db.query("SELECT balance FROM accounts WHERE user_id = " + user.id);

  if (balance > amount) {
    await db.query("UPDATE accounts SET balance = balance - " + amount);
    console.log("Transferred", amount);
  }

  return { ok: true };
}`
