import { describe, expect, it } from "vitest";

import {
  fadeIn,
  fadeInUp,
  quickTransition,
  scaleIn,
  slideInLeft,
  slideInRight,
  smoothTransition,
  springTransition,
  staggerContainer,
  staggerItem,
} from "./animations";

describe("Animation Variants", () => {
  describe("fadeInUp", () => {
    it("has correct initial state", () => {
      expect(fadeInUp.initial).toEqual({ opacity: 0, y: 30 });
    });

    it("has correct animate state", () => {
      expect(fadeInUp.animate).toEqual({ opacity: 1, y: 0 });
    });

    it("has correct exit state", () => {
      expect(fadeInUp.exit).toEqual({ opacity: 0, y: -30 });
    });
  });

  describe("fadeIn", () => {
    it("has correct initial state", () => {
      expect(fadeIn.initial).toEqual({ opacity: 0 });
    });

    it("has correct animate state", () => {
      expect(fadeIn.animate).toEqual({ opacity: 1 });
    });

    it("has correct exit state", () => {
      expect(fadeIn.exit).toEqual({ opacity: 0 });
    });
  });

  describe("scaleIn", () => {
    it("has correct initial state", () => {
      expect(scaleIn.initial).toEqual({ opacity: 0, scale: 0.9 });
    });

    it("has correct animate state", () => {
      expect(scaleIn.animate).toEqual({ opacity: 1, scale: 1 });
    });
  });

  describe("slideInLeft", () => {
    it("has correct initial state", () => {
      expect(slideInLeft.initial).toEqual({ opacity: 0, x: -50 });
    });

    it("has correct animate state", () => {
      expect(slideInLeft.animate).toEqual({ opacity: 1, x: 0 });
    });

    it("has correct exit state", () => {
      expect(slideInLeft.exit).toEqual({ opacity: 0, x: 50 });
    });
  });

  describe("slideInRight", () => {
    it("has correct initial state", () => {
      expect(slideInRight.initial).toEqual({ opacity: 0, x: 50 });
    });

    it("has correct animate state", () => {
      expect(slideInRight.animate).toEqual({ opacity: 1, x: 0 });
    });

    it("has correct exit state", () => {
      expect(slideInRight.exit).toEqual({ opacity: 0, x: -50 });
    });
  });

  describe("staggerContainer", () => {
    it("has correct transition configuration", () => {
      expect(staggerContainer.animate.transition.staggerChildren).toBe(0.1);
    });
  });

  describe("staggerItem", () => {
    it("has correct initial state", () => {
      expect(staggerItem.initial).toEqual({ opacity: 0, y: 20 });
    });

    it("has correct animate state", () => {
      expect(staggerItem.animate).toEqual({ opacity: 1, y: 0 });
    });
  });
});

describe("Transition Configurations", () => {
  describe("springTransition", () => {
    it("has correct type", () => {
      expect(springTransition.type).toBe("spring");
    });

    it("has correct stiffness", () => {
      expect(springTransition.stiffness).toBe(100);
    });

    it("has correct damping", () => {
      expect(springTransition.damping).toBe(20);
    });
  });

  describe("smoothTransition", () => {
    it("has correct duration", () => {
      expect(smoothTransition.duration).toBe(0.5);
    });

    it("has correct easing", () => {
      expect(smoothTransition.ease).toBe("easeInOut");
    });
  });

  describe("quickTransition", () => {
    it("has correct duration", () => {
      expect(quickTransition.duration).toBe(0.3);
    });

    it("has correct easing", () => {
      expect(quickTransition.ease).toBe("easeOut");
    });
  });
});
