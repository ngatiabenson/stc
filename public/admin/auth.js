// public/admin/auth.js
(function () {
    function checkProtection() {
        if (sessionStorage.getItem("stc_admin_session") === "verified") return;

        document.body.innerHTML = `
            <div style="background: #0F2C59; height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; margin:0; padding:0;">
                <div style="background: white; padding: 3rem; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); width: 100%; max-width: 400px; text-align: center;">
                    <div style="color: #C82333; font-size: 3rem; margin-bottom: 1rem;"><i class="fas fa-lock"></i></div>
                    <h2 style="color: #0F2C59; font-weight: 900; margin-bottom: 0.5rem; font-size: 1.5rem; margin-top:0;">STC Security Gateway</h2>
                    <p style="color: #64748B; font-size: 0.85rem; margin-bottom: 2rem;">Authorized Personnel Only. Database validation protocol active.</p>
                    
                    <input type="password" id="gatePass" placeholder="Enter Portal Passphrase" style="width: 100%; padding: 0.75rem; border: 1px solid #CBD5E1; border-radius: 4px; font-size: 1rem; text-align: center; margin-bottom: 1.25rem; box-sizing: border-box;">
                    <button onclick="verifyGatePassToServer()" style="background: #C82333; color: white; border: none; font-weight: 700; width: 100%; padding: 0.75rem; border-radius: 4px; cursor: pointer; text-transform: uppercase; font-size: 0.9rem; width:100%;">Authenticate</button>
                    
                    <div style="margin-top: 1.5rem; border-top: 1px solid #E2E8F0; padding-top: 1rem;">
                        <a href="#" onclick="triggerForgotNotice()" style="color: #64748B; font-size: 0.8rem; text-decoration: none; font-weight: 600;">Forgot Passphrase?</a>
                    </div>
                    <p id="gateError" style="color: #EF4444; font-size: 0.8rem; margin-top: 1rem; display: none; font-weight: bold;"></p>
                </div>
            </div>
        `;

        if (!document.getElementById("auth-fa-link")) {
            const link = document.createElement("link");
            link.id = "auth-fa-link"; link.rel = "stylesheet";
            link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
            document.head.appendChild(link);
        }
    }

    window.verifyGatePassToServer = async function() {
        const input = document.getElementById("gatePass").value;
        const errDisplay = document.getElementById("gateError");
        
        try {
            const response = await fetch('/api/auth/admin-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passphrase: input })
            });
            const data = await response.json();

            if (data.success) {
                sessionStorage.setItem("stc_admin_session", "verified");
                window.location.reload();
            } else {
                errDisplay.innerText = data.message;
                errDisplay.style.display = "block";
            }
        } catch (err) {
            errDisplay.innerText = "Connection to Core Logic Engine failed.";
            errDisplay.style.display = "block";
        }
    };

    window.triggerForgotNotice = function() {
        alert("🔒 SYSTEM SECURITY RECOVERY PROTOCOL:\n\nFor institutional compliance and data sovereignty protection, automated email password resetting is disabled on this localized node.\n\nTo reset a forgotten master passphrase, please contact the System Database Administrator to update the state parameter inside the 'system_config' SQL relational collection.");
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", checkProtection);
    } else {
        checkProtection();
    }
})();