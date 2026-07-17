export const getCurrentSession = async () => null;

export const onAuthChange = (callback) => {
  if (callback) { /* no-op */ }
  return { unsubscribe: () => {} };
};

export const getProfiles = async () => [];

export const logoutUser = async () => {
  window.location.reload();
};

export const loginUser = async (email, password) => {
  if (password) { /* no-op */ }
  await new Promise(r => setTimeout(r, 1000));
  if (email.includes('admin')) {
    return { user: { id: '1', email, full_name: 'Saboor Noor', role: 'admin' } };
  }
  return { user: { id: '2', email, full_name: 'Student User', role: 'user' } };
};

export const registerUser = async (email, password, username, full_name) => {
  if (password) { /* no-op */ }
  await new Promise(r => setTimeout(r, 1000));
  return { user: { id: '2', email, full_name, username, role: 'user' } };
};
