import crypto from "crypto";

export function generateRandom(bytes: number) {
  const n = crypto.randomBytes(bytes).toString("hex");
  return n;
}
export const oneDayInMS = 60 * 60 * 1000 * 24;
// https://hinds-app-media.s3.eu-north-1.amazonaws.com/6eaea7b4b6f600f4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAU6VTTQA5W7Y6OBOI%2F20250531%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20250531T112708Z&X-Amz-Expires=172800&X-Amz-Signature=0def0e2eec0e765d85b82b8614f7f35ef0e72e1060d7cda0cb67cc39bac6549a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject

// https://hinds-app-media.s3.eu-north-1.amazonaws.com/ac1cf2155c489752?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAU6VTTQA5W7Y6OBOI%2F20250531%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20250531T112917Z&X-Amz-Expires=172800&X-Amz-Signature=38a96e593a32725fa38e246da1d28cf33162d6f723c201a39012a73a86f283a0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
