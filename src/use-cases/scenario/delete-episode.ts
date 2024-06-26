import { ScenarioRepository } from '@/infra/db/protocols';

export class DeleteEpisodeUseCase {
  private scenarioRepository: ScenarioRepository;
  constructor(scenarioRepository: ScenarioRepository) {
    this.scenarioRepository = scenarioRepository;
  }
  async execute(id: number | string): Promise<void> {
    return await this.scenarioRepository.deleteEpisode(id);
  }
}
