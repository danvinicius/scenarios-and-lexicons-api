import { IScenario } from '@/entities';
import { ScenarioRepository } from '@/infra/db/protocols';

export class GetAllScenariosUseCase {
  private scenarioRepository: ScenarioRepository;

  constructor(scenarioRepository: ScenarioRepository) {
    this.scenarioRepository = scenarioRepository;
  }

  async execute(projectId: number | string): Promise<IScenario[]> {
    const scenarios = await this.scenarioRepository.getAllScenarios(projectId);
    return scenarios;
  }
}
