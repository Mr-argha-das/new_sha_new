const db = require("../config/db");
const { generatePasswordResetToken, verifyPasswordResetToken } = require("../utils/util");
const bcrypt = require("bcrypt");

exports.createPasswordResetToken = async (userId, userEmail) => {
    try {
        await db.execute(
            "DELETE FROM password_reset_tokens WHERE user_id = ? AND used = 0",
            [userId]
        );

        const payload = {
            userId: userId,
            email: userEmail,
            type: 'password_reset'
        };

        const token = generatePasswordResetToken(payload);

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        const sql = `
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES (?, ?, ?)
    `;
        await db.execute(sql, [userId, token, expiresAt]);

        return token;
    } catch (error) {
        console.error("createPasswordResetToken Error:", error);
        throw new Error("Failed to create password reset token");
    }
};

exports.verifyPasswordResetToken = async (token) => {
    try {
        const decoded = verifyPasswordResetToken(token);

        if (!decoded || decoded.type !== 'password_reset') {
            return null;
        }

        // Check if token exists in database and is not used
        const sql = `
      SELECT prt.*, u.id as user_id, u.email, u.name
      FROM password_reset_tokens prt
      JOIN users u ON prt.user_id = u.id
      WHERE prt.token = ? AND prt.used = 0 AND prt.expires_at > datetime('now')
      LIMIT 1
    `;
        const [rows] = await db.execute(sql, [token]);

        if (rows.length === 0) {
            return null;
        }

        // Verify that the token's userId matches the decoded token
        if (rows[0].user_id !== decoded.userId) {
            return null;
        }

        return rows[0];
    } catch (error) {
        console.error("verifyPasswordResetToken Error:", error);
        throw new Error("Failed to verify password reset token");
    }
};

// Mark token as used
exports.markTokenAsUsed = async (token) => {
    try {
        const sql = `
      UPDATE password_reset_tokens
      SET used = 1
      WHERE token = ?
    `;
        await db.execute(sql, [token]);
    } catch (error) {
        console.error("markTokenAsUsed Error:", error);
        throw new Error("Failed to mark token as used");
    }
};

// Update user password
exports.updateUserPassword = async (userId, newPassword) => {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const sql = `
      UPDATE users
      SET password = ?, updated_at = ?
      WHERE id = ?
    `;
        await db.execute(sql, [hashedPassword, new Date(), userId]);
    } catch (error) {
        console.error("updateUserPassword Error:", error);
        throw new Error("Failed to update password");
    }
};
