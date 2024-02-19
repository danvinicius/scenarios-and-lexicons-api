import { CreateScenarioRequestDTO } from "../../../../../application/dtos/create-scenario-request-dto";
import { IScenario } from "../../../entities/scenario";

export interface CreateScenarioUseCase {
  execute(scenario: CreateScenarioRequestDTO): Promise<IScenario>;
}
