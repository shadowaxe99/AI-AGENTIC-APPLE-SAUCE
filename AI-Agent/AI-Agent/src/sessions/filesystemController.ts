import {
  Controller,
  Path,
  Get,
  Delete,
  Put,
  Query,
  Route,
  BodyProp,
} from 'tsoa'
import { FileInfo as EntryInfo } from '@devbookhq/sdk'
import { dirname } from 'path'

import { CachedSession } from './session'

interface ListFilesystemDirResponse {
  entries: EntryInfo[]
}

interface ReadFilesystemFileResponse {
  content: string
}

@Route('sessions')
export class FilesystemController extends Controller {
  @Get('{sessionID}/filesystem/dirs')
  public async listFilesystemDir(
    @Path() sessionID: string,
    @Query() path: string,
  ): Promise<ListFilesystemDirResponse> {
    const entries = await CachedSession
      .findSession(sessionID)
      .session
      .filesystem!
      .list(path)

    return {
      entries,
    }
  }

  @Put('{sessionID}/filesystem/dirs')
  public async makeFilesystemDir(
    @Path() sessionID: string,
    @Query() path: string,
  ): Promise<void> {
    await CachedSession
      .findSession(sessionID)
      .session
      .filesystem
      ?.makeDir(path)
  }

  @Delete('{sessionID}/filesystem')
  public async deleteFilesystemEntry(
    @Path() sessionID: string,
    @Query() path: string,
  ) {
    await CachedSession
      .findSession(sessionID)
      .session
      .filesystem!
      .remove(path)
  }

  /**
   * 
   * Right now the returned content of the file will be UTF-8 encoded.
   * 
   * @param sessionID 
   * @param path 
   * @returns 
   */
  @Get('{sessionID}/filesystem/files')
  public async readFilesystemFile(
    @Path() sessionID: string,
    @Query() path: string,
  ): Promise<ReadFilesystemFileResponse> {
    const content = await CachedSession
      .findSession(sessionID)
      .session
      .filesystem!
      .read(path)

    return {
      content,
    }
  }

  /**
   * 
   * Right now the content of the file must be UTF-8 encoded.
   * 
   * @param sessionID 
   * @param path 
   * @param content 
   */
  @Put('{sessionID}/filesystem/files')
  public async writeFilesystemFile(
    @Path() sessionID: string,
    @Query() path: string,
    @BodyProp() content: string,
  ) {
    const dir = dirname(path)

    const session = CachedSession
      .findSession(sessionID)
      .session

    await session.filesystem!.makeDir(dir)
    await session.filesystem!.write(path, content)
  }
}
