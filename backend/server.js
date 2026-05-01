const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

let refreshTokens = [];

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1m',
  });
}

function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });

  refreshTokens.push(refreshToken);
  return refreshToken;
}

app.post('/login-token', (req, res) => {
  const { uid, email } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ message: 'UID dan email wajib diisi' });
  }

  const user = { uid, email };

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({
    accessToken,
    refreshToken,
  });
});

app.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token tidak ada' });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: 'Refresh token tidak valid' });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Refresh token expired' });
    }

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newUser = {
      uid: user.uid,
      email: user.email,
    };

    const newAccessToken = generateAccessToken(newUser);
    const newRefreshToken = generateRefreshToken(newUser);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
});

app.post('/logout-token', (req, res) => {
  const { refreshToken } = req.body;

  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

  res.json({
    message: 'Logout token berhasil',
  });
});

app.get('/', (req, res) => {
  res.send('Backend refresh token berjalan');
});

app.listen(process.env.PORT, () => {
  console.log(`Server berjalan di http://localhost:${process.env.PORT}`);
});