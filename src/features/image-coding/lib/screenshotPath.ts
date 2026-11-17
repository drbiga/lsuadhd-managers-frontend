/**
 * The feedback's `classifier_data.screenshot` is a path (and sometimes a URL)
 * pointing at the capture, for example:
 *
 *   screenshots/alice/3/2026-11-16T10-42-13.png
 *   https://bucket.example.com/alice/3/2026-11-16T10-42-13.png?X-Amz-Signature=...
 *   C:\captures\alice\3\2026-11-16T10-42-13.png
 *
 * The screenshot endpoint expects only the file name, so extract the last path
 * segment, drop any query/hash, and normalize Windows separators.
 */
export function screenshotNameFromPath(value: string): string {
  const withoutQuery = value.trim().split(/[?#]/, 1)[0].replace(/\\/g, "/");
  const fileName = withoutQuery.slice(withoutQuery.lastIndexOf("/") + 1);

  if (!fileName) {
    return "";
  }

  try {
    return decodeURIComponent(fileName);
  } catch {
    // A literal "%" in the file name is not valid percent-encoding.
    return fileName;
  }
}
