import { IProject } from "../../entities/project";
import { ProjectRepository } from "../../../repositories/project-repository";
import { GetProjectUseCase } from "./interfaces";

export class GetProject implements GetProjectUseCase {
  private projectRepository: ProjectRepository;

  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }
  async execute(id: number | string): Promise<null | IProject> {
    const project = this.projectRepository.getProject(id);
    return project;
  }
}
