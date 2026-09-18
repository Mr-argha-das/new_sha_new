const passwordResetService = require("../services/passwordReset.service");
const userService = require("../services/user.service");
const emailService = require("../utils/emailService");
const serverResponse = require("../utils/serverResponse");

// Request password reset
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userService.checkUserByEmail(email);

        if (!user) {
            return serverResponse.notFound(req, res, {
                message: "User not found with this email",
            });
        }
        try {
            const token = await passwordResetService.createPasswordResetToken(
                user.id,
                user.email
            );

            await emailService.sendPasswordResetEmail(
                user.email,
                user.name,
                token
            );

            console.log(`Password reset email sent to ${user.email}`);
        } catch (emailError) {
            console.error("Failed to send password reset email:", emailError);
        }

        return serverResponse.success(req, res, {
            message:
                "A password reset link has been sent to your email.",
        });
    } catch (error) {
        console.error("Request Password Reset Error:", error);
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Something went wrong",
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const authHeader = req.headers['x-token'];
        if (!authHeader) {
            return serverResponse.unauthorised(req, res, {
                message: "Reset token is required",
            });
        }
        const { password } = req.body;

        // Verify token
        const tokenData = await passwordResetService.verifyPasswordResetToken(
            authHeader
        );

        if (!tokenData) {
            return serverResponse.unauthorised(req, res, {
                message: "Invalid or expired reset token",
            });
        }

        // Update password
        await passwordResetService.updateUserPassword(
            tokenData.user_id,
            password
        );

        // Mark token as used
        await passwordResetService.markTokenAsUsed(authHeader);

        return serverResponse.success(req, res, {
            message: "Password has been reset successfully",
        });
    } catch (error) {
        console.error("Reset Password Error:", error);
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Something went wrong",
        });
    }
};

