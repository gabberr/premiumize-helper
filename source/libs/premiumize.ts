export interface Transfer {
  id: string;
  folder_id: string | null;
  file_id: string | null;
  message: string | null;
  name: string;
  src: string;
  status: 'running' | 'finished';
  progress: number;
}

const fetchPremiumize = async (endpoint: string, init?: RequestInit) => {
  const response = await fetch(
    `https://www.premiumize.me/api${endpoint}`,
    init
  );
  const json = await response.json();
  return json;
};

export const createTransfer = async (src: string) => {
  const formData = new FormData();
  formData.append('src', src);
  formData.append('folder_id', 'null');

  await fetchPremiumize('/transfer/create', {
    method: 'POST',
    mode: 'no-cors',
    credentials: 'include',
    body: formData,
  });
};

export const getTransfers = async () => {
  const response = await fetchPremiumize('/transfer/list');
  if (response.status === 'success') {
    return response.transfers as Transfer[];
  }

  return null;
};
