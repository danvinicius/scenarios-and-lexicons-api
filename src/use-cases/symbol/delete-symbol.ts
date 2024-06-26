import { SymbolRepository } from '@/infra/db/protocols';
import { InvalidParamError } from '@/util/errors';

export class DeleteSymbolUseCase {
  private symbolRepository: SymbolRepository;

  constructor(symbolRepository: SymbolRepository) {
    this.symbolRepository = symbolRepository;
  }

  async execute(id: string): Promise<void> {
    const symbolExists = await this.symbolRepository.getSymbol(id);
    if (!symbolExists) {
      throw new InvalidParamError('symbolId');
    }
    await this.symbolRepository.deleteSymbol(id);
  }
}
