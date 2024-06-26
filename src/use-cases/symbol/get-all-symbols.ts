import { ISymbol } from '@/entities';
import { SymbolRepository } from '@/infra/db/protocols';

export class GetAllSymbolsUseCase {
  private symbolRepository: SymbolRepository;

  constructor(symbolRepository: SymbolRepository) {
    this.symbolRepository = symbolRepository;
  }

  async execute(projectId: number | string): Promise<ISymbol[]> {
    const symbols = await this.symbolRepository.getAllSymbols(projectId);
    return symbols;
  }
}
