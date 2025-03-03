import { Client } from "ldapts";
import logger from "../config/logger.js";

/**
 * @returns {Client} LDAP client instance
 */
const _buildClient = () => {
  const ldapServerUri = process.env.LDAP_SERVER_URI;
  const client = new Client({
    url: ldapServerUri,
  });
  return client;
};

/**
 * @param {string} user - The username without the domain.
 * @returns {string} The prepared username with the domain.
 * @throws {Error} If LDAP_SERVER_DOMAIN is not defined.
 */
const prepareUser = (user) => {
  const [userNumber, domain] = [user, process.env.LDAP_SERVER_DOMAIN];
  if (!domain) {
    throw new Error("LDAP_SERVER_DOMAIN is not defined");
  }
  return `${userNumber}@${domain}`;
};

/**
 * @param {Client} client - The LDAP client instance
 * @returns {Promise<void>} Resolves if the disconnection is successful
 * @throws {Error} If an error occurs while disconnecting from LDAP
 */
const _disconnectLDAP = async (client) => {
  try {
    await client.unbind();
    logger.info("Disconnected from LDAP");
  } catch (error) {
    logger.error("Error occurred while disconnecting from LDAP:", error);
  }
};

/**
 * @param {Client} client - The LDAP client instance
 * @param {string} user - The username for authentication
 * @param {string} password - The password for authentication
 * @returns {Promise<Client>} Resolves if authentication is successful
 */
const _connectLDAP = async (client, user, password) => {
  try {
    logger.info(`Authenticating to LDAP for user: ${user}`);
    const shouldPrepare = false;
    const preparedUser = shouldPrepare ? prepareUser(user) : user;
    await client.bind(preparedUser, password);
    logger.info(`Authenticated to LDAP successfully for user: ${user}`);
    return true;
  } catch (error) {
    logger.error("Error occurred while authenticating to LDAP:", error);
    return false;
  } finally {
    await _disconnectLDAP(client);
  }
};

/**
 * @param {string} user - The username for authentication
 * @param {string} password - The password for authentication
 * @throws {Error} If user or password is missing
 * @returns {Promise<void>} Resolves if authentication is successful
 */
const authenticate = async (user, password) => {
  if (!user || !password) {
    throw new Error("User name and password are required");
  }
  const client = _buildClient();

  return _connectLDAP(client, user, password);
};

/**
 * @param {Client} client - The LDAP client instance
 * @param {string} user - The username to search for
 * @param {string} password - The password for authentication
 * @throws {Error} If user or password is missing
 * @returns {Promise<boolean>} Resolves to true if the user is found, false otherwise
 */
const isUser = async (client, user, password) => {
  if (!user || !password) {
    throw new Error("User name and password are required");
  }

  try {
    const searchResults = await client.search(process.env.LDAP_SEARCH_BASE, {
      scope: "sub",
      filter: `(|(samaccountname=${user}))`,
    });

    if (searchResults.searchEntries.length > 0) {
      return true;
    } else {
      logger.info("User not found in LDAP directory.");
      return false;
    }
  } catch (error) {
    logger.error("Error occurred during LDAP search:", error);
    return false;
  } finally {
    await _disconnectLDAP(client);
  }
};

/**
 * @param {Client} client - The LDAP client instance
 * @param {string} user - The username to search for
 * @param {string} password - The password for authentication
 * @throws {Error} If user or password is missing
 * @returns {Promise<object | boolean>} Resolves to the user object if found, false otherwise
 */
const getUser = async (client, user, password) => {
  if (!user || !password) {
    throw new Error("User name and password are required");
  }
  try {
    const { searchEntries } = await client.search(
      process.env.LDAP_SEARCH_BASE,
      {
        scope: "sub",
        filter: `(|(samaccountname=${user}))`,
      }
    );

    if (searchEntries.length > 0) {
      return searchEntries[0];
    }
    logger.info("User not found in LDAP directory.");
    return false;
  } catch (error) {
    logger.error("Error occurred during LDAP search:", error);
    return false;
  } finally {
    await _disconnectLDAP(client);
  }
};

/**
 * Checks if a given user can bind to the LDAP server and is present in the directory.
 *
 * @param {string} user - The username to check.
 * @throws {Error} If the username is not provided.
 * @returns {Promise<boolean>} Resolves to true if the user is found and can authenticate, false otherwise.
 */

const isJustUser = async (user) => {
  if (!user) {
    throw new Error("Username is required");
  }

  const client = _buildClient();

  try {
    await client.bind();
    logger.info("Connected to LDAP server annonymous successfully");

    const userDn = `${user}${process.env.LDAP_SERVER_DOMAIN}`;
    logger.info(`Checking connection for user: ${userDn}`);


    await client.bind(userDn);
    logger.info("User authenticated successfully");

    const { searchEntries } = await client.search(
      process.env.LDAP_SEARCH_BASE,
      {
        scope: "sub",
        filter: `(|(samaccountname=${user}))`,
      }
    );

    if (searchEntries.length > 0) {
      logger.info("User found in LDAP directory.");
      return true;
    } else {
      logger.info("User not found in LDAP directory.");
      return false;
    }
  } catch (error) {
    logger.error("Error during LDAP operation:", error);
    return false;
  } finally {
    await _disconnectLDAP(client);
  }
};

export default { authenticate };
