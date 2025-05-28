// app/constants/environment.ts
export type Environment = 'dev' | 'uat' | 'staging' | 'prod';

interface EnvironmentConfig {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  CLIENT_TYPE: string;
  ENVIRONMENT: Environment;
}

const environments: Record<Environment, EnvironmentConfig> = {
  dev: {
    API_BASE_URL: 'http://65.0.79.228:8080',
    API_TIMEOUT: 30000,
    CLIENT_TYPE: 'mobile',
    ENVIRONMENT: 'dev',
  },
  uat: {
    API_BASE_URL: 'http://uat.asegomate.com:8080',
    API_TIMEOUT: 30000,
    CLIENT_TYPE: 'mobile',
    ENVIRONMENT: 'uat',
  },
  staging: {
    API_BASE_URL: 'http://staging.asegomate.com:8080',
    API_TIMEOUT: 30000,
    CLIENT_TYPE: 'mobile',
    ENVIRONMENT: 'staging',
  },
  prod: {
    API_BASE_URL: 'https://api.asegomate.com:8080',
    API_TIMEOUT: 30000,
    CLIENT_TYPE: 'mobile',
    ENVIRONMENT: 'prod',
  },
};

// You can change this to switch environments
let CURRENT_ENVIRONMENT: Environment = 'dev';

export const ENV_CONFIG = environments[CURRENT_ENVIRONMENT];

// Export individual values for backward compatibility
export const API_BASE_URL = ENV_CONFIG.API_BASE_URL;
export const API_TIMEOUT = ENV_CONFIG.API_TIMEOUT;
export const CLIENT_TYPE = ENV_CONFIG.CLIENT_TYPE;
export const ENVIRONMENT = ENV_CONFIG.ENVIRONMENT;

// Helper function to check current environment
export const isDevelopment = () => ENVIRONMENT === 'dev';
export const isProduction = () => ENVIRONMENT === 'prod';
export const isStaging = () => ENVIRONMENT === 'staging';
export const isUAT = () => ENVIRONMENT === 'uat';