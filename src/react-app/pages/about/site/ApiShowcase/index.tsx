import { useState } from 'react';
import { Button, Card } from 'antd';

export default function ApiShowcase() {
  const [data, setData] = useState('');

  const get = async () => {
    const res = await fetch('/api/');
    const json = await res.json();
    setData(json.name);
  };

  return (
    <Card title="最小原型" style={{ maxWidth: 320, margin: '48px auto' }}>
      <Button type="primary" onClick={get}>
        点我
      </Button>
      {data && <div style={{ marginTop: 16 }}>{data}</div>}
    </Card>
  );
}