/**
 * @rulezero/core
 * Shared business logic library for MTG Commander Bracket Analyzer
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

// Infrastructure Layer (exported for advanced usage)
export { MoxfieldAdapter } from './infrastructure/MoxfieldAdapter.js';
export { ArchidektAdapter } from './infrastructure/ArchidektAdapter.js';
export { BracketAnalyzer } from './infrastructure/BracketAnalyzer.js';
export { HttpClient, CorsProxyHttpClient } from './infrastructure/HttpClient.js';
export { ScryfallAdapter } from './infrastructure/ScryfallAdapter.js';
