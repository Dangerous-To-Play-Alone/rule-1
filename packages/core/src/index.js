/**
 * @rulezero/core
 * Shared business logic library for Rule Minus One
 *
 * Following CLEAN Architecture principles:
 * - Domain: Pure business entities and value objects
 * - Use Cases: Application business rules
 * - Infrastructure: External interfaces and adapters
 */

// Domain Layer
export { Deck } from './domain/Deck.js';
export { BracketAnalysisResult } from './domain/BracketAnalysisResult.js';
export { CardCategory } from './domain/CardCategory.js';
export { Card } from './domain/Card.js';

// Use Cases Layer
export { FetchDeckBracketUseCase } from './usecases/FetchDeckBracketUseCase.js';
export { FetchDefaultBracketsUseCase } from './usecases/FetchDefaultBracketsUseCase.js';

// Infrastructure Layer (exported for advanced usage)
export { MoxfieldRepository } from './infrastructure/MoxfieldRepository.js';
export { ArchidektAdapter } from './infrastructure/ArchidektRepository.js';
export { BracketAnalyzer } from './infrastructure/BracketAnalyzer.js';
export { HttpClient, CorsProxyHttpClient } from './infrastructure/HttpClient.js';
export { ScryfallRepository } from './infrastructure/ScryfallRepository.js';
