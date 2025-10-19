import { Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { JSX } from "react";
import { Outlet } from "react-router-dom";

export default function GlobLayout(): JSX.Element {
    return (
        <Layout>
            <Header></Header>
            <Content>
                <Outlet />
            </Content>
            <Footer></Footer>
        </Layout>
    )
}