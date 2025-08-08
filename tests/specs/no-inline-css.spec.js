// Guard against inline CSS or style tags rendered in the body
const { test, expect } = require('@playwright/test');

// Utility to find CSS-like text nodes that are not inside allowed code containers
async function findCssLikeTextNodes(page) {
  return await page.evaluate(() => {
    const isIgnoredContainer = (el) => {
      while (el) {
        const tag = el.tagName && el.tagName.toLowerCase();
        if (tag === 'code' || tag === 'pre' || tag === 'script' || tag === 'style') return true;
        // Also ignore our demo code containers where CSS is displayed intentionally
        if (el.classList && el.classList.contains('code-example')) return true;
        el = el.parentElement;
      }
      return false;
    };

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const offenders = [];
    // Heuristic patterns that strongly indicate CSS rules, ids, or at-rules
    const cssPattern = /\.[A-Za-z0-9_-]+\s*\{|#[A-Za-z0-9_-]+\s*\{|@[a-z-]+\s*[^\{]*\{/;

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.nodeValue || '';
      const trimmed = text.trim();
      if (!trimmed) continue;
      if (node.parentElement && isIgnoredContainer(node.parentElement)) continue;

      if (cssPattern.test(trimmed)) {
        offenders.push(trimmed.slice(0, 200));
      }
    }
    return offenders;
  });
}

test.describe('No inline CSS or style tags in body', () => {
  test('body must not contain <style> tags', async ({ page }) => {
    await page.goto('/');
    const count = await page.locator('body style').count();
    expect(count).toBe(0);
  });

  test('body must not render raw CSS text (outside code/pre examples)', async ({ page }) => {
    await page.goto('/');
    const offenders = await findCssLikeTextNodes(page);
    expect(offenders, `Found CSS-like text nodes in body:\n${offenders.join('\n---\n')}`).toHaveLength(0);
  });
});
