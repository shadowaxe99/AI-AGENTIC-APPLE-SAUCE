import {
  components as devbookAPIComponents,
} from '@devbookhq/sdk'

/**
 * Type of environment to use.
 * This is used to determine which languages are installed by default.
 * 
 * @format env
 */
export type Environment = devbookAPIComponents['schemas']['Template']
