import {
  Controller,
  Delete,
  Path,
  Get,
  Post,
  BodyProp,
  Route,
} from 'tsoa'
import { OpenedPort as OpenPort } from '@devbookhq/sdk'

import { CachedSession } from './session'
import { Environment } from './environment'

interface SessionResponse {
  id: string
  ports: OpenPort[]
}

@Route('sessions')
export class SessionsController extends Controller {
  @Post()
  public async createSessions(
    @BodyProp() envID: Environment,
  ): Promise<SessionResponse> {
    const cachedSession = await new CachedSession(envID).init()

    return {
      id: cachedSession.id!,
      ports: cachedSession.ports,
    }
  }

  @Delete('{sessionID}')
  public async deleteSession(
    @Path() sessionID: string,
  ): Promise<void> {
    await CachedSession
      .findSession(sessionID)
      .delete()
  }

  /**
   * 
   * Use this endpoint to periodically refresh the session - if there was no request to the session for 10 minutes, it will be deleted.
   * 
   * @param sessionID 
   * @returns 
   */
  @Get('{sessionID}')
  public async getSession(
    @Path() sessionID: string,
  ): Promise<SessionResponse> {
    const cachedSession = CachedSession.findSession(sessionID)

    return {
      id: cachedSession.id!,
      ports: cachedSession.ports,
    }
  }
}
