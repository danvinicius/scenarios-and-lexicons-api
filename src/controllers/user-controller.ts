import { Request } from 'express';
import * as DTO from '@/infra/http/dtos';
import { validate } from '@/util/validation/validate';
import {
  badRequest,
  created,
  ok,
  serverError,
  unauthorized,
} from '@/infra/http/response';
import {
  EmailInUseError,
  InvalidParamError,
  MissingParamError,
  UnauthorizedError,
} from '@/util/errors';
import { AuthenticateUserUseCase, CreateUserUseCase } from '@/use-cases/user';

export class UserController {
  constructor(
    private authenticateUserUseCase: AuthenticateUserUseCase,
    private createUserUseCase: CreateUserUseCase
  ) {}

  createUser = async (req: Request) => {
    try {
      const user = new DTO.CreateUserRequestDTO(req.body);
      await validate(user);
      const userCreated = await this.createUserUseCase.execute(user);
      return created(userCreated);
    } catch (error: any) {
      if (
        error instanceof InvalidParamError ||
        error instanceof EmailInUseError ||
        error instanceof MissingParamError
      ) {
        return badRequest(error);
      }
      return serverError(error);
    }
  };

  authenticateUser = async (req: Request) => {
    try {
      const login = new DTO.AuthenticateUserRequestDTO(req.body);
      await validate(login);
      const user = await this.authenticateUserUseCase.execute(login);
      const logged = new DTO.AuthenticateUserResponseDTO(user);
      return ok(logged);
    } catch (error: any) {
      if (
        error instanceof InvalidParamError ||
        error instanceof MissingParamError
      ) {
        return badRequest(error);
      }
      if (error instanceof UnauthorizedError) {
        return unauthorized(error);
      }
      return serverError(error);
    }
  };
}
