import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    const result = cn("px-4", "py-2");
    expect(result).toBe("px-4 py-2");
  });

  it("should handle conditional class names", () => {
    const result = cn("base-class", false && "hidden", "visible");
    expect(result).toBe("base-class visible");
  });

  it("should merge Tailwind classes with conflicts", () => {
    const result = cn("px-2", "px-4");
    // twMerge should resolve conflicts, keeping the last one
    expect(result).toBe("px-4");
  });

  it("should handle empty or undefined values", () => {
    const result = cn("class1", undefined, null, "", "class2");
    expect(result).toBe("class1 class2");
  });

  it("should handle arrays and objects", () => {
    const result = cn(["class1", "class2"], { class3: true, class4: false });
    expect(result).toBe("class1 class2 class3");
  });
});
