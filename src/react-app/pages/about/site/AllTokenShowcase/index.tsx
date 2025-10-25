import { useMemo } from 'react';
import { Card, Row, Col, Typography, theme } from 'antd';
const { Title, Text } = Typography;

type Entry = [string, string | number];

export default function AllTokenShowcase() {
    // 直接继承外层 ConfigProvider 的 token，不自己设主色
    const token = theme.useToken().token;

    const { colors, sizes, shadows, raw } = useMemo(() => {
        const c: Entry[] = [];
        const s: Entry[] = [];
        const h: Entry[] = [];
        const r: Entry[] = [];

        Object.entries(token).forEach(([k, v]) => {
            if (typeof v === 'string') {
                if (/^(#|rgb|hsl)/.test(v)) c.push([k, v]);
                else if (v.includes('box-shadow')) h.push([k, v]); // ✅ 保证 string
                else r.push([k, v]);
            } else if (typeof v === 'number') {
                s.push([k, v]);
            } else {
                r.push([k, String(v)]);
            }
        });

        return { colors: c, sizes: s, shadows: h, raw: r };
    }, [token]);

    /* ---------- 渲染函数 ---------- */
    const renderColor = (list: Entry[]) =>
        list.map(([k, v]) => (
            <Col key={k} xs={12} sm={8} md={6} lg={4}>
                <Card size="small">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span
                            style={{
                                background: v,
                                width: 32,
                                height: 32,
                                borderRadius: 4,
                                marginRight: 8,
                                border: '1px solid #f0f0f0',
                            }}
                        />
                        <div>
                            <Text style={{ fontSize: 12, color: '#999' }}>{k}</Text>
                            <div style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</div>
                        </div>
                    </div>
                </Card>
            </Col>
        ));

    const renderSize = (list: Entry[]) =>
        list.map(([k, v]) => (
            <Col key={k} xs={12} sm={8} md={6} lg={4}>
                <Card size="small">
                    <Text style={{ fontSize: 12, color: '#999' }}>{k}</Text>
                    <div
                        style={{
                            height: 8,
                            background: '#bae7ff',
                            width: Number(v),
                            marginTop: 8,
                            borderRadius: 2,
                        }}
                    />
                    <div style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}px</div>
                </Card>
            </Col>
        ));

    const renderShadow = (list: Entry[]) =>
        list.map(([k, v]) => (
            <Col key={k} xs={12} sm={8} md={6} lg={4}>
                <Card size="small" style={{ boxShadow: v }}>  {/* ✅ v 一定是 string */}
                    <Text style={{ fontSize: 12, color: '#999' }}>{k}</Text>
                    <div style={{ fontFamily: 'monospace', fontSize: 12, marginTop: 8 }}>
                        {v}
                    </div>
                </Card>
            </Col>
        ));

    const renderRaw = (list: Entry[]) =>
        list.map(([k, v]) => (
            <Col key={k} xs={12} sm={8} md={6} lg={4}>
                <Card size="small">
                    <Text style={{ fontSize: 12, color: '#999' }}>{k}</Text>
                    <pre
                        style={{
                            fontSize: 12,
                            margin: 0,
                            marginTop: 4,
                            padding: 4,
                            background: '#fafafa',
                            borderRadius: 2,
                        }}
                    >
                        {v}
                    </pre>
                </Card>
            </Col>
        ));

    /* ---------- 页面结构 ---------- */
    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>Ant Design 5 全 Token 可视化</Title>

            <Title level={5} style={{ marginTop: 32 }}>
                颜色 ({colors.length})
            </Title>
            <Row gutter={[16, 16]}>{renderColor(colors)}</Row>

            <Title level={5} style={{ marginTop: 32 }}>
                尺寸/间距 ({sizes.length})
            </Title>
            <Row gutter={[16, 16]}>{renderSize(sizes)}</Row>

            <Title level={5} style={{ marginTop: 32 }}>
                阴影 ({shadows.length})
            </Title>
            <Row gutter={[16, 16]}>{renderShadow(shadows)}</Row>

            <Title level={5} style={{ marginTop: 32 }}>
                其余字符串 ({raw.length})
            </Title>
            <Row gutter={[16, 16]}>{renderRaw(raw)}</Row>
        </div>
    );
}