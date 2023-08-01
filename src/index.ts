import express, {
  urlencoded,
  text,
  json,
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from 'express'
import { ValidateError } from 'tsoa'
import morgan from 'morgan'
import cors from 'cors'

import { RegisterRoutes } from './generated/routes'
import { defaultPort } from './constants'

export const app = express()

app.use(
  cors(),
  urlencoded({
    extended: true,
  }),
  morgan('tiny'),
  text(),
  json(),
)


RegisterRoutes(app)

app.use(
  function notFoundHandler(_req, res: ExResponse) {
    res.status(500).send({
      message: 'Not Found',
    })
  },
  function errorHandler(
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
  ): ExResponse | void {
    if (err instanceof ValidateError) {
      console.warn(`Caught Validation Error for ${req.path}:`, err.fields, err)
      return res.status(422).json({
        message: 'Validation Failed',
        details: err?.fields,
      })
    }
    if (err instanceof Error) {
      console.warn(`Caught Internal Error for ${req.path}:`, err)
      return res.status(500).json({
        message: 'Internal Server Error',
      })
    }
    next()
  },
)

const port = process.env.PORT || defaultPort

app.listen(port, () =>
  console.log(`Listening at http://localhost:${port}`)
)
