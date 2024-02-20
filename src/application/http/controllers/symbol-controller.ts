import { CreateSymbolUseCase } from "../../../core/domain/use-cases/symbol/interfaces/create-symbol";
import { GetAllSymbolsUseCase } from "../../../core/domain/use-cases/symbol/interfaces/get-all-symbols";
import { GetSymbolUseCase } from "../../../core/domain/use-cases/symbol/interfaces/get-symbol";
import { UpdateSymbolUseCase } from "../../../core/domain/use-cases/symbol/interfaces/update-symbol";
import { DeleteSymbolUseCase } from "../../../core/domain/use-cases/symbol/interfaces/delete-symbol";
import express, { Response, Request, NextFunction } from "express";
import { NotFoundError } from "../../errors/not-found-error";
import { BadRequestError } from "../../errors/bad-request-error";
import { validate } from "../../helpers/validate";
import { CreateSymbolRequestDTO } from "../dtos/create-symbol-request-dto";
import { UpdateSymbolRequestDTO } from "../dtos/update-symbol-request-dto";
import { AddImpactRequestDTO } from "../dtos/add-impact-request-dto";
import { AddImpactUseCase } from "../../../core/domain/use-cases/symbol/interfaces/add-impact";
import { AddSynonymUseCase } from "../../../core/domain/use-cases/symbol/interfaces/add-synonym";
import { AddSynonymRequestDTO } from "../dtos/add-synonym-request-dto";
import { RemoveImpactUseCase } from "../../../core/domain/use-cases/symbol/interfaces/remove-impact";
import { RemoveSynonymUseCase } from "../../../core/domain/use-cases/symbol/interfaces/remove-synonym";
import { Logger } from "../../../config/logger"

export default function SymbolController(
  getSymbolUseCase: GetSymbolUseCase,
  getAllSymbolsUseCase: GetAllSymbolsUseCase,
  createSymbolUseCase: CreateSymbolUseCase,
  updateSymbolUseCase: UpdateSymbolUseCase,
  deleteSymbolUseCase: DeleteSymbolUseCase,
  addImpactUseCase: AddImpactUseCase,
  addSynonymUseCase: AddSynonymUseCase,
  removeImpact: RemoveImpactUseCase,
  removeSynonym: RemoveSynonymUseCase,
) {
  const router = express.Router();
  const logger = Logger.getInstance()

  router.get("/project/:projectId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const symbols = await getAllSymbolsUseCase.execute(projectId);
      if (!symbols?.length) {
        throw new NotFoundError("There are no symbols");
      }
      return res.json(symbols);
    } catch (error: any) {
      logger.error(error.message)
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
      logger.error(error.message)
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
    } catch (error: any) {
      logger.error(error.message)
      next(error);
    }
  });
  router.post("/impact", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const impact = new AddImpactRequestDTO(req.body);
      await validate(impact);
      await addImpactUseCase.execute(impact);
      return res.status(201).json({ message: "Impact added" });
    } catch (error: any) {
      logger.error(error.message)
      next(error);
    }
  });
  router.post("/synonym", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const synonym = new AddSynonymRequestDTO(req.body);
      await validate(synonym);
      await addSynonymUseCase.execute(synonym);
      return res.status(201).json({ message: "Synonym added" });
    } catch (error: any) {
      logger.error(error.message)
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
    } catch (error: any) {
      logger.error(error.message)
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
    } catch (error: any) {
      logger.error(error.message)
      next(error);
    }
  }
  );
  router.delete("/impact/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await removeImpact.execute(id);
      return res.json({ message: "Impact deleted" });
    } catch (error: any) {
      logger.error(error.message)
      next(error);
    }
  }
  );
  router.delete("/synonym/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await removeSynonym.execute(id);
      return res.json({ message: "Synonym deleted" });
    } catch (error: any) {
      logger.error(error.message)
      next(error);
    }
  }
  );

  return router;
}