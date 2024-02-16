import { CreateSymbolUseCase } from "../../interfaces/use-cases/symbol/create-symbol";
import { GetAllSymbolsUseCase } from "../../interfaces/use-cases/symbol/get-all-symbols";
import { GetSymbolUseCase } from "../../interfaces/use-cases/symbol/get-symbol";
import { UpdateSymbolUseCase } from "../../interfaces/use-cases/symbol/update-symbol";
import { DeleteSymbolUseCase } from "../../interfaces/use-cases/symbol/delete-symbol";
import express, { Response, Request, NextFunction } from "express";
import { NotFoundError } from "../errors/not-found-error";
import { BadRequestError } from "../errors/bad-request-error";
import { validate } from "../helpers/validate";
import { CreateSymbolRequestDTO } from "../../domain/dto/create-symbol-request-dto";
import { UpdateSymbolRequestDTO } from "../../domain/dto/update-symbol-request-dto";

export default function SymbolRouter(
  getSymbolUseCase: GetSymbolUseCase,
  getAllSymbolsUseCase: GetAllSymbolsUseCase,
  createSymbolUseCase: CreateSymbolUseCase,
  updateSymbolUseCase: UpdateSymbolUseCase,
  deleteSymbolUseCase: DeleteSymbolUseCase
) {
  const router = express.Router();

  router.get("/project/:projectId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const symbols = await getAllSymbolsUseCase.execute(projectId);
      if (!symbols?.length) {
        throw new NotFoundError("There are no symbols");
      }
      return res.json(symbols);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const symbol = await getSymbolUseCase.execute(id);
        if (!symbol) {
          throw new NotFoundError("Symbol not found");
        }
        return res.json(symbol);
      } catch (error: any) {
        next(error);
      }
    }
  );
  router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const symbol = new CreateSymbolRequestDTO(req.body);
      await validate(symbol);
      const symbolCreated = await createSymbolUseCase.execute(symbol);
      return res.status(201).json(symbolCreated);
    } catch (error) {
      next(error);
    }
  });
  router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const symbol = new UpdateSymbolRequestDTO(req.body);
        await validate(symbol);
        const symbolExists = await getSymbolUseCase.execute(id);
        if (!symbolExists) {
          throw new BadRequestError("This symbol does not exist");
        }
        await updateSymbolUseCase.execute(id, symbol);
        return res.json({ message: "Symbol updated" });
      } catch (error) {
        next(error);
      }
    }
  );
  router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const symbolExists = await getSymbolUseCase.execute(id);
        if (!symbolExists) {
          throw new BadRequestError("his symbol does not exist");
        }
        await deleteSymbolUseCase.execute(id);
        return res.json({ message: "Symbol deleted" });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
