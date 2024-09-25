const verifyEmailTemplate = (otp, name) => {
  return `
    <html>
      <body>
        <p><strong>${name}</strong></p>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>Thank you for registering with us.</p>
      </body>
    </html>
  `;
};

module.exports = verifyEmailTemplate;
