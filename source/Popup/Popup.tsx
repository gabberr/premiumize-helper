import React, {useState, useEffect, useMemo} from 'react';
import {getTransfers, Transfer} from '../libs/premiumize';

import './styles.scss';

const TransferItem: React.FC<Transfer> = ({
  folder_id,
  name,
  message,
  status,
  progress,
}) => {
  const link = folder_id
    ? `https://www.premiumize.me/files?folder_id=${folder_id}`
    : '';

  const icon =
    status === 'finished' ? '✅' : `⏳ (${(progress * 100).toFixed(2)}%)`;

  return (
    <li title={name} className="text">
      <div>
        <span>{icon}</span>
        <a href={link} title={name} target="_blank" rel="noreferrer">
          {name.slice(0, 42)}
        </a>
      </div>
      {message && <div className="message">{message}</div>}
    </li>
  );
};

const filterTransfers = (transfers: Transfer[], text: string) =>
  transfers.filter((transfer) =>
    transfer.name.toLocaleLowerCase().includes(text.toLocaleLowerCase())
  );

const Popup: React.FC = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');
  const [isError, setError] = useState<boolean>(false);

  const filteredTransfers = useMemo(
    () => filterTransfers(transfers, searchInput),
    [searchInput, transfers]
  );

  useEffect(() => {
    const load = async () => {
      const transfersResult = await getTransfers();
      if (transfersResult) {
        setTransfers(transfersResult);
      } else {
        setError(true);
      }
    };
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  if (isError) {
    return (
      <section id="popup">
        <h1>Could not load transfers.</h1>
        <p>
          Try login again:
          <a href="https:///www.premiumize.me">www.premiumize.me</a>
        </p>
      </section>
    );
  }

  return (
    <section id="popup">
      <h1>Latest transfers:</h1>
      <input
        type="text"
        placeholder="Search..."
        className="search"
        value={searchInput}
        onChange={(e) => setSearchInput(e.currentTarget.value)}
      />
      <ul className="transfers">
        {filteredTransfers.map((transfer) => (
          <TransferItem {...transfer} key={transfer.id} />
        ))}
      </ul>
    </section>
  );
};

export default Popup;
