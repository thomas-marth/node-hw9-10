const mustChangePassword = (req, res, next) => {
  const user = req.user;

  if (user && user.mustChangePassword) {
    return res.status(403).json({
      message: "You must change your password before accessing this resource.",
      redirectTo: "/change-password",
    });
  }

  next();
};

export default mustChangePassword;
