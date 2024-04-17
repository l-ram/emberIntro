/**
 * Type declarations for
 *    import config from 'my-app/config/environment'
 */
declare const config: {
  MAPBOX_ACCESS_TOKEN: string;
  environment: string;
  modulePrefix: string;
  podModulePrefix: string;
  locationType: 'history' | 'hash' | 'none' | 'auto';
  rootURL: string;
  APP: Record<string, unknown>;
};

export default config;
