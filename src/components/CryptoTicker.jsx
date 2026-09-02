import React, { useEffect, useRef } from 'react';

const CryptoTicker = () => {
    const container = useRef();

    useEffect(() => {
        // Prevent appending multiple scripts in React StrictMode
        if (container.current && container.current.children.length === 1) {
            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = JSON.stringify({
                "symbols": [
                    { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
                    { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" },
                    { "proName": "BINANCE:BNBUSD", "title": "BNB" },
                    { "proName": "BINANCE:SOLUSD", "title": "Solana" },
                    { "proName": "BINANCE:XRPUSD", "title": "XRP" },
                    { "proName": "BITSTAMP:ADAUSD", "title": "Cardano" }
                ],
                "showSymbolLogo": true,
                "isTransparent": false,
                "displayMode": "regular",
                "colorTheme": "light",
                "locale": "en"
            });
            container.current.appendChild(script);
        }
    }, []);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '46px', zIndex: 1000, borderBottom: '1px solid #eee', background: 'white' }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
};

export default CryptoTicker;
