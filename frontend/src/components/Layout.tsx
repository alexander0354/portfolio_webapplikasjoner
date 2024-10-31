import { ReactNode } from 'react';

function Layout({ children }: { children: ReactNode }) {
    return (
        <div>
            <header>
                <h1>Min Portefølje</h1>
            </header>
            <main>{children}</main>
            <footer>
                <p>Footer Content</p>
            </footer>
        </div>
    );
}

export default Layout;
