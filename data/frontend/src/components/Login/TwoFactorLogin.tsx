import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router";

function TwoFactorLogin() {
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [error, setError] = useState<boolean>(false);
    const navigate = useNavigate();
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean | null>(false);

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

    useEffect(() => {
        async function checkTwoFactorStatus() {
            try {
                const response = await fetch("http://localhost:5000/2fa/status", {
                    credentials: "include",
                });
                const data = await response.json();
                console.log('data ', data);
                await setIsTwoFactorEnabled(data.isTwoFactorEnabled);
                console.log('isTwoFactorEnabled', isTwoFactorEnabled);
            } catch (error) {
                if (error instanceof Error) {
                    console.log('Error:', error.message);
                } else {
                    console.log('An unknown error occurred:', error);
                }
            }
        }
        checkTwoFactorStatus();
    }, [isTwoFactorEnabled]);

    async function validateTwoFactorCode() {
        try {
            const response = await fetch("http://localhost:5000/2fa/turn-on", {
                method: 'post',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ twoFactorAuthCode: twoFactorCode })
            });

            if (response.ok) {
                console.log('2FA is turned on.');
                setError(false);
                navigate('/home');
            } else {
                console.log('Wrong authentication code');
                setError(true);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log('Error:', error.message);
            } else {
                console.log('An unknown error occurred:', error);
            }
        }
    }

    return (
        <div>
            <p>Coucou depuis la page 'TwoFactorLogin'</p>
            <p>Scannez le QrCode pour obtenir un code de validation</p>
            <div>
                {!isTwoFactorEnabled && qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" id="qrCodeImage" />}
            </div>
            <div>
                <input
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="Entrez le code de validation"
                />
                <button onClick={validateTwoFactorCode}>Valider</button>
            </div>
            {error && <p>Code incorrect, veuillez réessayer.</p>}
        </div>
    );
}

export default TwoFactorLogin;
