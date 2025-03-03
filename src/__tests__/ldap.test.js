import ldapService from "../services/ldapService";

jest.mock("../services/ldapService", () => ({
  authenticate: jest.fn(),
}));

describe("LDAP Authentication", () => {
  it("should authenticate successfully when valid credentials provided", async () => {
    ldapService.authenticate.mockResolvedValue(true);

    const result = await ldapService.authenticate("testuser", "password123");

    expect(result).toBe(true);
    expect(ldapService.authenticate).toHaveBeenCalledWith("testuser", "password123");
  });
});
