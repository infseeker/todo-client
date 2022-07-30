import { load } from 'recaptcha-v3';

export const recaptcha = async function () {
  const r = await load('6LcX-58gAAAAAJ94B93UPTv-K3YnLZn8J3M2j-wr');
  return await r.execute('login');
};
