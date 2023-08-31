import React, { useEffect, useState } from 'react';

function TwoFactorLogin() {
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

    useEffect(() => {
        async function fetchQrCode() {
            try {
                const response = await fetch("http://localhost:5000/2fa/generate", {
                    method: 'post',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'image/png',
                    },
                });
                const data = await response.blob();
                const url = URL.createObjectURL(data);
                setQrCodeUrl(url);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log('Error:', error.message);
                } else {
                    console.log('An unknown error occurred:', error);
                }
            }
        }

        fetchQrCode();
    }, []);

    return (
        <div>
            <p>Coucou depuis la page 'TwoFactorLogin'</p>
            <p>Scannez le QrCode pour obtenir un code de validation</p>
            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" id="qrCodeImage" />}
        </div>
    );
}

export default TwoFactorLogin;
