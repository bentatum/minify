jest.autoMockOff();

const plugin = require("../src/index");
const thePlugin = require("../../../utils/test-transform")(plugin);

describe("inline-env-plugin", () => {
  let prev;
  beforeAll(() => {
    prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
  });
  afterAll(() => {
    process.env.NODE_ENV = prev;
  });

  thePlugin(
    "should inline environment variables",
    `
    process.env.NODE_ENV
  `,
    `
    "development";
  `
  );

  thePlugin(
    "should only include whitelisted variables if include option is specified",
    "process.env.NODE_ENV",
    "process.env.NODE_ENV;",
    {
      plugins: [[plugin, { include: ["IS_ELECTRON"] }]]
    }
  );

  thePlugin(
    "should not include blacklisted variables if exclude option is specified",
    "process.env.NODE_ENV",
    "process.env.NODE_ENV;",
    {
      plugins: [[plugin, { exclude: ["NODE_ENV"] }]]
    }
  );
});
