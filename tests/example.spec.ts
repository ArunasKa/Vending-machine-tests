import { test, expect, Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://127.0.0.1:5500/index.html");
});
const TestItems = [
  '1',
  '2',
  '3'
];
  test('Should allow me to add 5eur', async ({page})=>{
  await page.getByTestId('fiveEuro').fill(TestItems[0]);
  await expect(page.getByText('5.00', { exact: true })).toBeVisible();

  })
  

