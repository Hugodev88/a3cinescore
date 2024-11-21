// src/components/Footer.js
import React from "react";

const Footer = () => {
    return (
        <footer className="footer bg-dark text-white py-3">
            <div className="container text-center">
                <p className="mb-1">© 2024 CineScore. Todos os direitos reservados.</p>
                <p className="mb-0">
                    <a href="/privacy" className="text-white text-decoration-none mx-2">
                        Política de Privacidade
                    </a>
                    |
                    <a href="/terms" className="text-white text-decoration-none mx-2">
                        Termos de Uso
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
