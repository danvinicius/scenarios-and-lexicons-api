import { ScenarioRepository } from "../../../interfaces/repositories/scenario-repository";
import { Scenario } from "./entity/Scenario";
import { DataSource } from "typeorm";
import { Project } from "./entity/Project";
import { CreateScenarioRequestDTO } from "../../../domain/dto/create-scenario-request-dto";
import { UpdateScenarioRequestDTO } from "../../../domain/dto/update-scenario-request-dto";

export class MySQLScenarioRepository implements ScenarioRepository {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async getScenario(id: number): Promise<Scenario> {
    const [scenario] = await this.dataSource.manager.find(Scenario, {
      where: {
        id,
      },
      relations: {
        exceptions: true,
        episodes: true,
        context: true,
        resources: true,
        actors: true,
        groups: true,
        project: true,
      },
    });
    if (!scenario) {
      throw new Error("Scenario not found");
    }
    return scenario;
  }
  async getAllScenarios(projectId: number): Promise<Scenario[]> {
    const scenarios = await this.dataSource.manager.find(Scenario, {
      where: {
        project: {
          id: projectId
        }
      },
      relations: {
        exceptions: true,
        episodes: true,
        context: true,
        resources: true,
        actors: true,
        groups: true,
      },
    });
    return scenarios;
  }
  async createScenario(data: CreateScenarioRequestDTO): Promise<Scenario> {
    try {
      const [project] = await this.dataSource.manager.findBy(Project, {
        id: data.projectId as number,
      });
      if (!project) {
        throw new Error("Project does not exist");
      }
      const scenario = new Scenario();
      scenario.title = data.title;
      scenario.goal = data.goal;
      scenario.project = project;

      await this.dataSource.manager.save(Scenario, scenario);

      return scenario;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async updateScenario(id: string, data: UpdateScenarioRequestDTO): Promise<void> {
    try {
      await this.dataSource.manager.update(Scenario, { id }, data);
    } catch (error) {
      throw new Error("Error on updating scenario");
    }
  }
  async deleteScenario(id: string): Promise<void> {
    try {
      await this.dataSource.manager.delete(Scenario, id);
    } catch (error) {
      throw new Error("Error on deleting scenario");
    }
  }
}
