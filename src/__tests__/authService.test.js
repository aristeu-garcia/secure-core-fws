import jwt from "jsonwebtoken";
import { createHmac } from "crypto";
import authRepository from "../repositories/authRepository.js";
import logger from "../config/logger.js";
import {
  createAccessToken,
  createRefreshToken,
  setRefreshCookie,
} from "../services/authService.js";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("crypto", () => ({
  createHmac: jest.fn(() => ({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnValue("hashedToken"),
  })),
}));

jest.mock("../repositories/authRepository.js", () => ({
  set: jest.fn(),
  delete: jest.fn(),
}));

jest.mock("../config/logger.js", () => ({
  info: jest.fn(),
}));

describe("Auth Service", () => {
  const mockUser = { user: "testuser" };
  const mockToken = "mockJwtToken";

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.LDAP_SERVER_DOMAIN = "example.com";
    process.env.ACCESS_TOKEN_SECRET = "access-secret";
    process.env.REFRESH_TOKEN_SECRET = "refresh-secret";
    process.env.ACCESS_TOKEN_DURATION_MINUTES = "30";
    process.env.REFRESH_TOKEN_DURATION_MINUTES = "60";
    process.env.DELETE_TOKEN_EXPIRATION_TIME_MINUTES = "0";
  });

  describe("createAccessToken", () => {
    it("should return a signed access token", () => {
      jwt.sign.mockReturnValue(mockToken);

      const result = createAccessToken(mockUser);

      expect(result).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: mockUser.user, domain: "example.com" },
        "access-secret",
        {
          audience: "urn:jwt:type:access",
          issuer: "urn:system:token-issuer:type:access",
          expiresIn: "30m",
        }
      );
    });
  });

  describe("createRefreshToken", () => {
    it("should return a signed refresh token and store its hash", () => {
      jwt.sign.mockReturnValue(mockToken);

      const result = createRefreshToken(mockUser);

      expect(result).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: mockUser.user, domain: "example.com" },
        "access-secret",
        {
          audience: "urn:jwt:type:refresh",
          issuer: "urn:system:token-issuer:type:refresh",
          expiresIn: "60m",
        }
      );
      expect(createHmac).toHaveBeenCalledWith("sha512", "refresh-secret");
      expect(authRepository.set).toHaveBeenCalledWith("hashedToken", undefined);
    });

    it("should delete the token after expiration time", () => {
      jest.useFakeTimers();
      jwt.sign.mockReturnValue(mockToken);

      createRefreshToken(mockUser);
      jest.runAllTimers();

      expect(authRepository.delete).toHaveBeenCalledWith("hashedToken");
      expect(logger.info).toHaveBeenCalledWith(
        "Refresh token hashedToken expired"
      );

      jest.useRealTimers();
    });
  });

  describe("setRefreshCookie", () => {
    it("should set a refresh token cookie", () => {
      const mockResponse = {
        cookie: jest.fn(),
      };

      setRefreshCookie(mockResponse, mockToken);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        "refresh-token",
        mockToken,
        {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          expires: expect.any(Date),
        }
      );
    });
  });
});
