import { getDiscussionType } from "./getDiscussionType";

describe("check getDiscussionType", () => {
  it("check text without value ", () => {
    expect(getDiscussionType("text text")).toEqual([]);
  });
  it("check value in text", () => {
    expect(getDiscussionType("text [[value1]] text")).toEqual(["value1"]);
  });
  it("check multiple values in text", () => {
    expect(getDiscussionType("text [[value1]] [[value2]] text")).toEqual([
      "value1",
      "value2",
    ]);
  });
  it("check value with different symbols", () => {
    expect(
      getDiscussionType("text [[value-1]] [[value:2]] [[value.3]]text")
    ).toEqual(["value-1", "value:2", "value.3"]);
  });
});
