/**
 * Split block text into visual lines (SplitText-style) for staggered line reveals.
 */
export function splitElementIntoLines(element: HTMLElement): () => void {
  const originalHTML = element.innerHTML;
  const originalClassName = element.className;
  const text = element.textContent?.trim() ?? "";

  if (!text) {
    return () => {
      element.innerHTML = originalHTML;
      element.className = originalClassName;
    };
  }

  const tokens = text.match(/\S+|\s+/g) ?? [text];
  element.replaceChildren();

  const wordSpans: HTMLSpanElement[] = [];

  for (const token of tokens) {
    if (/^\s+$/.test(token)) {
      element.appendChild(document.createTextNode(token));
      continue;
    }

    const span = document.createElement("span");
    span.className = "inline-block";
    span.textContent = token;
    element.appendChild(span);
    wordSpans.push(span);
  }

  const lineGroups: HTMLSpanElement[][] = [];
  let lastTop: number | null = null;
  let current: HTMLSpanElement[] = [];

  for (const span of wordSpans) {
    const top = Math.round(span.offsetTop);
    if (lastTop !== null && top !== lastTop) {
      lineGroups.push(current);
      current = [];
    }
    current.push(span);
    lastTop = top;
  }

  if (current.length > 0) lineGroups.push(current);

  element.replaceChildren();

  for (const group of lineGroups) {
    const mask = document.createElement("div");
    mask.className = "about-story-line overflow-hidden";

    const inner = document.createElement("div");
    inner.className = "about-story-line-inner";

    group.forEach((span, index) => {
      inner.appendChild(span);
      if (index < group.length - 1) {
        inner.appendChild(document.createTextNode(" "));
      }
    });

    mask.appendChild(inner);
    element.appendChild(mask);
  }

  return () => {
    element.innerHTML = originalHTML;
    element.className = originalClassName;
  };
}

/** Split text into per-character masks for staggered char reveals. */
export function splitElementIntoChars(element: HTMLElement): () => void {
  const originalHTML = element.innerHTML;
  const originalClassName = element.className;
  const text = element.textContent?.trim() ?? "";

  if (!text) {
    return () => {
      element.innerHTML = originalHTML;
      element.className = originalClassName;
    };
  }

  element.replaceChildren();

  for (const char of text) {
    const mask = document.createElement("span");
    mask.className = "split-char-mask";

    const inner = document.createElement("span");
    inner.className = "split-char-inner";
    inner.textContent = char;

    mask.appendChild(inner);
    element.appendChild(mask);
  }

  return () => {
    element.innerHTML = originalHTML;
    element.className = originalClassName;
  };
}
