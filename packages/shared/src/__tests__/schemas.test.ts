import { describe, it, expect } from "vitest";
import { LoginSchema, SignupSchema } from "../schemas/auth";
import { UserProfileSchema, BiometricsSchema } from "../schemas/user";
import { OnboardingInputSchema } from "../schemas/onboarding";
import { GoalSchema } from "../schemas/goal";

describe("Auth Schemas", () => {
  describe("LoginSchema", () => {
    it("should validate correct login data", () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
      };
      expect(() => LoginSchema.parse(validData)).not.toThrow();
    });

    it("should reject invalid email", () => {
      const invalidData = {
        email: "invalid-email",
        password: "password123",
      };
      expect(() => LoginSchema.parse(invalidData)).toThrow();
    });

    it("should reject short password", () => {
      const invalidData = {
        email: "test@example.com",
        password: "123",
      };
      expect(() => LoginSchema.parse(invalidData)).toThrow();
    });
  });

  describe("SignupSchema", () => {
    it("should validate correct signup data", () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
        termsAccepted: true,
      };
      expect(() => SignupSchema.parse(validData)).not.toThrow();
    });

    it("should reject mismatched passwords", () => {
      const invalidData = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "different123",
        termsAccepted: true,
      };
      expect(() => SignupSchema.parse(invalidData)).toThrow();
    });

    it("should reject when terms not accepted", () => {
      const invalidData = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
        termsAccepted: false,
      };
      expect(() => SignupSchema.parse(invalidData)).toThrow();
    });
  });
});

describe("User Schemas", () => {
  describe("BiometricsSchema", () => {
    it("should validate correct biometrics", () => {
      const validData = {
        age: 25,
        height: 175,
        weight: 70,
        gender: "male" as const,
      };
      expect(() => BiometricsSchema.parse(validData)).not.toThrow();
    });

    it("should reject invalid age", () => {
      const invalidData = {
        age: 5, // Too young
        height: 175,
        weight: 70,
        gender: "male" as const,
      };
      expect(() => BiometricsSchema.parse(invalidData)).toThrow();
    });

    it("should reject invalid height", () => {
      const invalidData = {
        age: 25,
        height: 50, // Too short
        weight: 70,
        gender: "male" as const,
      };
      expect(() => BiometricsSchema.parse(invalidData)).toThrow();
    });
  });
});

describe("Onboarding Schema", () => {
  it("should validate complete onboarding data", () => {
    const validData = {
      fitnessGoal: "build_strength" as const,
      experienceLevel: "beginner" as const,
      biometrics: {
        age: 25,
        height: 175,
        weight: 70,
        gender: "male" as const,
      },
      workoutPreferences: {
        preferredDuration: 30,
        weeklyFrequency: 3,
        availableEquipment: ["dumbbells"],
        preferredTimeOfDay: "evening" as const,
      },
    };
    expect(() => OnboardingInputSchema.parse(validData)).not.toThrow();
  });
});

describe("Goal Schema", () => {
  it("should validate goal data", () => {
    const validData = {
      id: "goal-1",
      userId: "user-1",
      type: "weight_loss" as const,
      targetValue: 10,
      currentValue: 0,
      unit: "kg",
      startDate: new Date(),
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(() => GoalSchema.parse(validData)).not.toThrow();
  });
});
