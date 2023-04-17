import { test, expect, Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://127.0.0.1:5500/index.html");
});
const testString = '21';
const testValue = parseInt(testString);
const DescriptionText = "A vending machine sells candies for €2 each. You can insert money in coins in various denominations (for example 2 x 3 + 1 x 5 + 0.10 x2 = 11.20). When a candy is requested and the machine has the required amount of money, you can purchase it. When the required amount is too much - it gives change. If it is too little - you can not buy your selected candy. Also, if you cancel your order it gives all the money inserted back.";

test.describe("General tests for functionality", () => {
  test("Add all available amounts and check to see total", async ({ page }) => {
    await page.getByTestId("fiveEuro").fill(testString);
    await page.getByTestId("twoEuro").fill(testString);
    await page.getByTestId("oneEuro").fill(testString);
    await page.getByTestId("tenCents").fill(testString);
    if(testValue% 10)
    {
      await expect(page.locator("#Total")).toHaveText(`${testValue*5+testValue*2+testValue*1+testValue*0.1}0`);  
    }
    else{
      await expect(page.locator("#Total")).toHaveText(`${testValue*5+testValue*2+testValue*1+testValue*0.1}.00`);    
    }
  });
  //Cancel does not work
  test("Add 5eur and cancel to get money back", async ({ page }) => {
    await page.getByTestId("fiveEuro").fill(testString);
    await expect(page.locator("#Total")).toHaveText(`${testValue*5}.00`);
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.locator("#Total")).toHaveText("0");
    await expect(page.locator("#message")).toHaveText(
      `Transaction cancelled. €${testValue*5} has been returned`
    );

  });
  test("Press description button to get description to show", async ({ page }) => {
    await page.getByRole('button', { name: 'Description' }).click();
    await expect(page.locator('#description')).toHaveText(DescriptionText);

  });
});
test.describe("Test for buying first product (Twix) with different amounts inserted", () => {
  test("Add 5eur coins(more than product price), buy  twix ", async ({
    page,
  }) => {
    await page.getByTestId("fiveEuro").fill(testString);
    await expect(page.locator("#Total")).toHaveText(`${testValue*5}.00`);
    await page.getByTestId("twix").click();
    await expect(page.locator("#message")).toHaveText(
      `Twix has been bought. €${testValue*5-2}.00 returned.`
    );
    await expect(page.locator("#Total")).toHaveText("0");
  });
  //error: when buying only one euqal price doent work
  test("Add 2eur coins(equal to product price), buy  twix", async ({
    page,
  }) => {
    await page.getByTestId("twoEuro").fill(testString);
    await expect(page.locator("#Total")).toHaveText(`${testValue*2}.00`);
    await page.getByTestId("twix").click();
    await expect(page.locator("#message")).toHaveText(
      `Twix has been bought. €${parseInt(testString)*2-2}.00 returned.`
    );
    await expect(page.locator("#Total")).toHaveText("0");
  });
  //error: after denial doesnt give back money and doesnt have any left
  test("Add 1eur coins(less than product price), to buy  twix", async ({
    page,
  }) => {
    await page.getByTestId("oneEuro").fill(testString);
    await expect(page.locator("#Total")).toHaveText(`${testValue*1}.00`);
    await page.getByTestId("twix").click();
    if(testValue*1<2)
    {
      await expect(page.locator("#message")).toHaveText(
        `You have not paid enough. €${testValue*1}.00 has been returned.`
      );
      await expect(page.locator("#Total")).toHaveText(`${testValue*1}.00`);
    }
    else{
      await expect(page.locator("#message")).toHaveText(
        `Twix has been bought. €${testValue*1-2}.00 returned.`
      );
    }
    
  });
  
  //error: after denial doesnt give back money and doesnt have any left
  test("Add 10 cents coins(less than product price), to buy  twix", async ({
    page,
  }) => {
    await page.getByTestId("tenCents").fill(testString);
    await expect(page.locator("#Total")).toHaveText(`${(testValue*0.1).toFixed(1)}0`);
    await page.getByTestId("twix").click();
    if(testValue*0.1<2)
    {
      await expect(page.locator("#message")).toHaveText(
        `You have not paid enough. €${(testValue*0.1).toFixed(1)}0 has been returned.`
      );
      await expect(page.locator("#Total")).toHaveText(`${testValue*1}0`);
    }
    else{
      await expect(page.locator("#message")).toHaveText(
        `Twix has been bought. €${(testValue*0.1-2).toFixed(1)}0 returned.`
      );
    }
    
  });
  test("Add all available amounts and buy Twix", async ({
    page,
  }) => {
    await page.getByTestId("fiveEuro").fill(testString);
    await page.getByTestId("twoEuro").fill(testString);
    await page.getByTestId("oneEuro").fill(testString);
    await page.getByTestId("tenCents").fill(testString);
    if(testValue%10)
    {
      await expect(page.locator("#Total")).toHaveText(`${testValue*5+testValue*2+testValue*1+testValue*0.1}0`);
      await page.getByTestId("twix").click();
      await expect(page.locator("#message")).toHaveText(
        `Twix has been bought. €${testValue*5+testValue*2+testValue*1+testValue*0.1-2}0 returned.`
      );
    }
    else{
      await expect(page.locator("#Total")).toHaveText(`${testValue*5+testValue*2+testValue*1+testValue*0.1}.00`);
      await page.getByTestId("twix").click();
      await expect(page.locator("#message")).toHaveText(
        `Twix has been bought. €${testValue*5+testValue*2+testValue*1+testValue*0.1-2}.00 returned.`
      );
    }
    
    await expect(page.locator("#Total")).toHaveText("0");
  });
});
test.describe("Test for buying first product (Chocolate) with different amounts inserted", () => {
  test("Add 5eur coins(more than product price), buy  Chocolate", async ({
    page,
  }) => {
    await page.getByTestId("fiveEuro").fill(testString);
    await expect(page.locator("#Total")).toHaveText(`${testValue*5}.00`);
    await page.getByTestId("chocolate").click();
    await expect(page.locator("#message")).toHaveText(
      `Chocolate has been bought. €${testValue*5-2}.00 returned.`
    );
    await expect(page.locator("#Total")).toHaveText("0");
  });
  //error: when buying only one euqal price doent work
  test("Add 2eur coins(equal to product price), buy  Chocolate", async ({
    page,
  }) => {
    await page.getByTestId("twoEuro").fill(testString);
    await expect(page.locator("#Total")).toHaveText(`${testValue*2}.00`);
    await page.getByTestId("chocolate").click();
    await expect(page.locator("#message")).toHaveText(
      `Chocolate has been bought. €${parseInt(testString)*2-2}.00 returned.`
    );
    await expect(page.locator("#Total")).toHaveText("0");
  });
  //error: after denial doesnt give back money and doesnt have any left
  test("Add 1eur coins(less than product price), to buy  Chocolate", async ({
    page,
  }) => {
    await page.getByTestId("oneEuro").fill(testString);
    await expect(page.locator("#Total")).toHaveText(`${testValue*1}.00`);
    await page.getByTestId("chocolate").click();
    if(testValue*1<2)
    {
      await expect(page.locator("#message")).toHaveText(
        `You have not paid enough. €${testValue*1}.00 has been returned.`
      );
      await expect(page.locator("#Total")).toHaveText(`${testValue*1}.00`);
    }
    else{
      await expect(page.locator("#message")).toHaveText(
        `Chocolate has been bought. €${testValue*1-2}.00 returned.`
      );
    }
    
  });
  
  //error: after denial doesnt give back money and doesnt have any left
  test("Add 10 cents coins(less than product price),to buy  Chocolate", async ({
    page,
  }) => {
    await page.getByTestId("tenCents").fill(testString);
    await expect(page.locator("#Total")).toHaveText(`${(testValue*0.1).toFixed(1)}0`);
    await page.getByTestId("chocolate").click();
    if(testValue*0.1<2)
    {
      await expect(page.locator("#message")).toHaveText(
        `You have not paid enough. €${(testValue*0.1).toFixed(1)}0 has been returned.`
      );
      await expect(page.locator("#Total")).toHaveText(`${testValue*1}0`);
    }
    else{
      await expect(page.locator("#message")).toHaveText(
        `Chocolate has been bought. €${(testValue*0.1-2).toFixed(1)}0 returned.`
      );
    }
    
  });
  test("Add all available amounts and buy Chocolate", async ({
    page,
  }) => {
    await page.getByTestId("fiveEuro").fill(testString);
    await page.getByTestId("twoEuro").fill(testString);
    await page.getByTestId("oneEuro").fill(testString);
    await page.getByTestId("tenCents").fill(testString);
    if(testValue%10){
      await expect(page.locator("#Total")).toHaveText(`${testValue*5+testValue*2+testValue*1+testValue*0.1}0`);
      await page.getByTestId("chocolate").click();
      await expect(page.locator("#message")).toHaveText(
        `Chocolate has been bought. €${testValue*5+testValue*2+testValue*1+testValue*0.1-2}0 returned.`
      );
    }
    else{
      await expect(page.locator("#Total")).toHaveText(`${testValue*5+testValue*2+testValue*1+testValue*0.1}.00`);
      await page.getByTestId("chocolate").click();
      await expect(page.locator("#message")).toHaveText(
        `Chocolate has been bought. €${testValue*5+testValue*2+testValue*1+testValue*0.1-2}.00 returned.`
      );
    }
    
    await expect(page.locator("#Total")).toHaveText("0");
  });
});
test.describe("Test for buying first product (Brownie) with different amounts inserted", () => {
  test("Add 5eur coins(more than product price), buy Brownie", async ({
    page,
  }) => {
    await page.getByTestId("fiveEuro").fill(testString);
    await expect(page.locator("#Total")).toHaveText(`${testValue*5}.00`);
    await page.getByTestId("brownie").click();
    await expect(page.locator("#message")).toHaveText(
      `Brownie has been bought. €${testValue*5-2}.00 returned.`
    );
    await expect(page.locator("#Total")).toHaveText("0");
  });
  //error: when buying only one euqal price doent work
  test("Add 2eur coins(equal to product price), buy  Brownie", async ({
    page,
  }) => {
    await page.getByTestId("twoEuro").fill(testString);
    await expect(page.locator("#Total")).toHaveText(`${testValue*2}.00`);
    await page.getByTestId("brownie").click();
    await expect(page.locator("#message")).toHaveText(
      `Brownie has been bought. €${parseInt(testString)*2-2}.00 returned.`
    );
    await expect(page.locator("#Total")).toHaveText("0");
  });
  //error: after denial doesnt give back money and doesnt have any left
  test("Add 1eur coins(less than product price), to buy  Brownie", async ({
    page,
  }) => {
    await page.getByTestId("oneEuro").fill(testString);
    await expect(page.locator("#Total")).toHaveText(`${testValue*1}.00`);
    await page.getByTestId("brownie").click();
    if(testValue*1<2)
    {
      await expect(page.locator("#message")).toHaveText(
        `You have not paid enough. €${testValue*1}.00 has been returned.`
      );
      await expect(page.locator("#Total")).toHaveText(`${testValue*1}.00`);
    }
    else{
      await expect(page.locator("#message")).toHaveText(
        `Brownie has been bought. €${testValue*1-2}.00 returned.`
      );
    }
    
  });
  
  //error: after denial doesnt give back money and doesnt have any left
  test("Add 10 cents coins(less than product price), to buy  Brownie", async ({
    page,
  }) => {
    await page.getByTestId("tenCents").fill(testString);
    await expect(page.locator("#Total")).toHaveText(`${(testValue*0.1).toFixed(1)}0`);
    await page.getByTestId("brownie").click();
    if(testValue*0.1<2)
    {
      await expect(page.locator("#message")).toHaveText(
        `You have not paid enough. €${(testValue*0.1).toFixed(1)}0 has been returned.`
      );
      await expect(page.locator("#Total")).toHaveText(`${testValue*1}0`);
    }
    else{
      await expect(page.locator("#message")).toHaveText(
        `Brownie has been bought. €${(testValue*0.1-2).toFixed(1)}0 returned.`
      );
    }
    
  });
  test("Add all available amounts and buy Brownie", async ({
    page,
  }) => {
    await page.getByTestId("fiveEuro").fill(testString);
    await page.getByTestId("twoEuro").fill(testString);
    await page.getByTestId("oneEuro").fill(testString);
    await page.getByTestId("tenCents").fill(testString);
    if(testValue%10)
    {
      await expect(page.locator("#Total")).toHaveText(`${testValue*5+testValue*2+testValue*1+testValue*0.1}0`);
      await page.getByTestId("brownie").click();
      await expect(page.locator("#message")).toHaveText(
        `Brownie has been bought. €${testValue*5+testValue*2+testValue*1+testValue*0.1-2}0 returned.`
      );
    }
    else{
      await expect(page.locator("#Total")).toHaveText(`${testValue*5+testValue*2+testValue*1+testValue*0.1}.00`);
    await page.getByTestId("brownie").click();
    await expect(page.locator("#message")).toHaveText(
      `Brownie has been bought. €${testValue*5+testValue*2+testValue*1+testValue*0.1-2}.00 returned.`
    );
    }
    
    await expect(page.locator("#Total")).toHaveText("0");
  });
});
