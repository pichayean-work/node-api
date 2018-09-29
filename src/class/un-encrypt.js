const encodeStr = function (uncoded) {
    return Buffer.from(uncoded).toString("base64");
}
const decodeStr = function(coded) {
    return Buffer.from(coded, "base64").toString();
} 

module.exports = { encodeStr, decodeStr };