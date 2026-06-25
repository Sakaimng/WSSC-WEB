import { randomBytes } from "node:crypto";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSegment(length: number) {
  const bytes = randomBytes(length);
  let segment = "";

  for (let index = 0; index < length; index += 1) {
    segment += CODE_ALPHABET[bytes[index]! % CODE_ALPHABET.length];
  }

  return segment;
}

export function generateTicketCode() {
  return `WSSC-${randomSegment(4)}-${randomSegment(4)}`;
}
