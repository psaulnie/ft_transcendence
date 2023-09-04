import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function TwoFactorLogin() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [twoFactorTurnOnCode, setTwoFactorTurnOnCode] = useState("");
  const [twoFactorAuthCode, setTwoFactorAuthCode] = useState("");
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean | null>(
    false,
  );

  useEffect(() => {
    async function checkTwoFactorStatus() {
      try {
        const response = await fetch("http://localhost:5000/2fa/status", {
          credentials: "include",
        });
        const data = await response.json();
        setIsTwoFactorEnabled(data);
        if (!data) {
          fetchQrCode();
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log("Error:", error.message);
        } else {
          console.log("An unknown error occurred:", error);
        }
      }
    }
    checkTwoFactorStatus();
  }, []);

  async function fetchQrCode() {
    try {
      const response = await fetch("http://localhost:5000/2fa/generate", {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "image/png",
        },
      });
      const data = await response.blob();
      const url = URL.createObjectURL(data);
      setQrCodeUrl(url);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Error:", error.message);
      } else {
        console.log("An unknown error occurred:", error);
      }
    }
  }

  async function validateTwoFactorTurnOnCode() {
    try {
      const response = await fetch("http://localhost:5000/2fa/turn-on", {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ twoFactorAuthCode: twoFactorTurnOnCode }),
      });

      if (response.ok) {
        console.log("2FA is turned on.");
        setError(false);
        navigate("/home");
      } else {
        console.log("Wrong authentication code");
        setError(true);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Error:", error.message);
      } else {
        console.log("An unknown error occurred:", error);
      }
    }
  }

  async function validateTwoFactorAuthCode() {
    try {
      const response = await fetch("http://localhost:5000/2fa/authenticate", {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ twoFactorAuthCode: twoFactorAuthCode }),
      });

      if (response.ok) {
        console.log("2FA authentication successfully.");
        setError(false);
        navigate("/home");
      } else {
        console.log("Wrong authentication code");
        setError(true);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Error:", error.message);
      } else {
        console.log("An unknown error occurred:", error);
      }
    }
  }

  return (
    <div>
      <p>Coucou depuis la page 'TwoFactorLogin'</p>

      {isTwoFactorEnabled ? (
        <>
          <div>
            <input
              type="text"
              value={twoFactorAuthCode}
              onChange={(e) => setTwoFactorAuthCode(e.target.value)}
              placeholder="Enter validation code"
            />
            <button onClick={validateTwoFactorAuthCode}>Validate</button>
          </div>
        </>
      ) : (
        <>
          <p>Scan the QrCode to obtain a validation code</p>
          <div>
            {qrCodeUrl && (
              <img src={qrCodeUrl} alt="QR Code" id="qrCodeImage" />
            )}
          </div>
          <div>
            <input
              type="text"
              value={twoFactorTurnOnCode}
              onChange={(e) => setTwoFactorTurnOnCode(e.target.value)}
              placeholder="Enter validation code"
            />
            <button onClick={validateTwoFactorTurnOnCode}>Validate</button>
          </div>
        </>
      )}

      {error && <p>Incorrect code, please try again.</p>}
    </div>
  );
}

export default TwoFactorLogin;
