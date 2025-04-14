export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();
  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true, // Always true in production
      sameSite: "None", // Required for cross-domain
      domain: ".vercel.app", // Allow all vercel subdomains
      path: "/",
    })
    .json({
      success: true,
      user,
      message,
      token,
    });
};