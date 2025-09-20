package org.example.backend.Util;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
public class PayHereUtil {
    public static String md5Upper(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString().toUpperCase();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // Verify Hash (for IPN/notify callback)
    public static boolean verifyMd5(String merchantId, String orderId, String amount,
                                    String currency, String statusCode, String merchantSecret, String receivedMd5) {
        String formattedAmount = String.format("%.2f", new BigDecimal(amount));
        String secretMd5 = md5Upper(merchantSecret);
        String raw = merchantId + orderId + formattedAmount + currency + statusCode + secretMd5;
        String calc = md5Upper(raw);
        return calc.equals(receivedMd5 != null ? receivedMd5.toUpperCase() : null);
    }

    public static String generateHash(String merchantId, String orderId, String amount, String currency, String merchantSecret) {
        try {
            String formattedAmount = String.format("%.2f", new BigDecimal(amount));
            String secretMd5 = md5Upper(merchantSecret);
            String raw = merchantId + orderId + formattedAmount + currency + secretMd5;
            return md5Upper(raw);
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }
}
