import React, { useEffect, useState } from 'react';

interface Order {
  id: number;
  service: string;
  price: number;
  details: string;
  status: string;
  result_file?: string;
  user_id: number;
  username: string;
  usertag: string;
  // Добавим поле дата (для примера, если появится в бэке)
  created_at?: string;
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  done: <span style={{ fontSize: 22 }}>✅</span>,
  new: <span style={{ fontSize: 22 }}>🔄</span>,
  process: <span style={{ fontSize: 22 }}>🔄</span>,
};

const STATUS_TEXT: Record<string, string> = {
  done: 'Завершено',
  new: 'В процессе',
  process: 'В процессе',
};

const History: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получаем user_id из localStorage профиля
    const profile = localStorage.getItem('userProfile');
    let user_id = null;
    if (profile) {
      try {
        user_id = JSON.parse(profile).savedUserTag || null;
      } catch {}
    }
    // Для теста можно подставить user_id вручную
    if (!user_id) return;
    fetch(`http://localhost:8000/orders/${user_id}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100%',
      background: 'none',
      fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <div style={{
        background: '#2D1E5A',
        borderRadius: '40px',
        padding: '24px 18px',
        maxWidth: '340px',
        width: '100%',
        margin: '20px auto',
        boxShadow: '0 4px 32px 0 rgba(0,0,0,0.12)',
        position: 'relative',
        top: '-40px'
      }}>
        <h2 style={{
          color: 'white',
          fontSize: '24px',
          fontWeight: 500,
          textAlign: 'center',
          marginBottom: '20px',
          fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
        }}>Мои заказы</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 2fr 1.2fr 1.5fr 1fr',
          color: 'white',
          fontSize: 16,
          fontWeight: 400,
          marginBottom: 12,
          borderBottom: '2px solid #fff2',
          paddingBottom: 8,
        }}>
          <div>№</div>
          <div>Услуга</div>
          <div>Дата</div>
          <div>Статус</div>
          <div style={{marginLeft: 18}}>Цена</div>
        </div>
        {loading ? (
          <div style={{ color: '#BEB8D1', textAlign: 'center', marginTop: 24 }}>Загрузка...</div>
        ) : (
          orders.map((order, idx) => (
            <div key={order.id} style={{
              display: 'grid',
              gridTemplateColumns: '40px 2fr 1.2fr 1.5fr 1fr',
              alignItems: 'center',
              color: 'white',
              fontSize: 16,
              fontWeight: 400,
              borderBottom: '1px solid #fff1',
              padding: '10px 0',
            }}>
              <div style={{ fontFamily: 'monospace', fontSize: 15 }}>{String(idx + 1).padStart(2, '0')}</div>
              <div style={{ wordBreak: 'break-word' }}>{order.service}</div>
              <div>{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{STATUS_ICONS[order.status] || STATUS_ICONS['new']}{STATUS_TEXT[order.status] || STATUS_TEXT['new']}</div>
              <div style={{ color: '#09FBD3', fontWeight: 600, marginLeft: 18 }}>${order.price}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History; 