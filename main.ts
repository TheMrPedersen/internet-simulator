serial.redirectToUSB()
input.onButtonPressed(Button.A, function () {
    basic.showString("" + (control.deviceSerialNumber()))
})
let encryptionKey = 0; // Initialize encryption key

// Function to set the encryption key
function setEncryptionKey() {
    let key = 1234;
    //let key = input.askForNumber("Enter 4-digit encryption key");
    if (isNaN(key) || key < 1000 || key > 9999) {
        console.log("Invalid encryption key. Please enter a 4-digit number.");
        setEncryptionKey();
    } else {
        encryptionKey = key;
    }
}

// Function to encrypt a message using the encryption key
function encryptMessage(message: string): string {
    let encryptedMessage = "";
    for (let i = 0; i < message.length; i++) {
        encryptedMessage += String.fromCharCode(message.charCodeAt(i) ^ encryptionKey);
    }
    return encryptedMessage;
}

// Function to decrypt a message using the encryption key
function decryptMessage(encryptedMessage: string): string {
    let decryptedMessage = "";
    for (let i = 0; i < encryptedMessage.length; i++) {
        decryptedMessage += String.fromCharCode(encryptedMessage.charCodeAt(i) ^ encryptionKey);
    }
    return decryptedMessage;
}

// Function to send a radio package containing recipient's address, sender's address, and encrypted message
function sendRadioPackage(recipient: string, message: string) {
    let sender = control.deviceSerialNumber();
    let encryptedMessage = encryptMessage(message);
    let packageData = JSON.stringify({ recipient: recipient, sender: sender.toString(), message: encryptedMessage });
    radio.sendString(packageData);
}

// Event handler for receiving radio packages
radio.onDataPacketReceived(({ receivedString: data }) => {
    let package = JSON.parse(data);
    let decryptedMessage = decryptMessage(package.message);
    console.log(`Received message: "${decryptedMessage}" from ${package.sender} (recipient: ${package.recipient})`);
});

// Start by setting the encryption key
setEncryptionKey();

// Example usage:
// sendRadioPackage("recipient's serial number", "Hello, recipient!");
