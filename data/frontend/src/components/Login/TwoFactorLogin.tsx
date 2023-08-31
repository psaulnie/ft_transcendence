function TwoFactorLogin() {

    function generateQrCode() {
        fetch("http://localhost:5000/2fa/generate", {
            method: 'post',
            credentials: "include",
            headers: {
                'Content-Type': 'image/png',
            },
        }).then((response) => {
            return response.blob();
        }).then((data) => {
            // Create URL from blob()
            const url = URL.createObjectURL(data);
            // Find or create an element img to display image
            let img = document.getElementById('qrCodeImage');
            if (!img) {
                img = document.createElement('img');
                img.id = 'qrCodeImage';
                document.body.appendChild(img);
            }
            // Update the attribute src of img element
            (img as HTMLImageElement).src = url;
        }).catch(error => {
            console.log('Error:', error.message);
        });
        return 'Scannez le QrCode pour obtenir un code de validation';
    }

    return (
        <div>
            <p>Coucou depuis la page 'TwoFactorLogin'</p>
            <p>
                {generateQrCode()}</p>
        </div>
    );
}

export default TwoFactorLogin;
