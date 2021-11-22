import React, { Fragment } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';



interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <Fragment>
            <Header />
            {children}
            <Footer />
        </Fragment>
    );
};
