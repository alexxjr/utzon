// const crypto = require('crypto');
//
// async function createUser(username, password) {
//     let hash = await generateHash(password);
//     DatabaseConnection.opretBruger(username, hash);
// }
//
// async function validateUser(username, password) {
//     let passwordFromDatabase = DatabaseConnection.getPassword(username);
//     return validatePassword(password, passwordFromDatabase);
// }
//
// async function generateHash(password) {
//     const salt = crypto.randomBytes(16).toString('hex');
//     let iterations = 65536;
//
//     const hash = crypto.pbkdf2
// }
//
// private static String toHex(byte[] array) {
//     BigInteger bi = new BigInteger(1, array);
//     String hex = bi.toString(16);
//     int paddingLength = (array.length * 2) - hex.length();
//     if (paddingLength > 0) {
//         return String.format("%0" + paddingLength + "d", 0) + hex;
//     } else {
//         return hex;
//     }
// }
//
// private static boolean validatePassword(String originalPassword, String storedPassword) {
//     String[] parts = storedPassword.split(":");
//     int iterations = Integer.parseInt(parts[0]);
//     byte[] salt = fromHex(parts[1]);
//     byte[] hash = fromHex(parts[2]);
//
//     PBEKeySpec spec = new PBEKeySpec(originalPassword.toCharArray(), salt, iterations, hash.length * 8);
//     SecretKeyFactory skf;
//     try {
//         skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
//         byte[] testHash = skf.generateSecret(spec).getEncoded();
//
//         int diff = hash.length ^ testHash.length;
//         for (int i = 0; i < hash.length && i < testHash.length; i++) {
//             diff |= hash[i] ^ testHash[i];
//         }
//         return diff == 0;
//     } catch (NoSuchAlgorithmException e) {
//         e.printStackTrace();
//     } catch (InvalidKeySpecException e) {
//         e.printStackTrace();
//     }
//     return false;
//
// }
//
// private static byte[] fromHex(String hex) {
//     byte[] bytes = new byte[hex.length() / 2];
//     for (int i = 0; i < bytes.length; i++) {
//         bytes[i] = (byte) Integer.parseInt(hex.substring(2 * i, 2 * i + 2), 16);
//     }
//     return bytes;
// }
//
// public static void init() {
//     DatabaseConnection.openConnection();
// }