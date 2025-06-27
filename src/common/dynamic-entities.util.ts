import { readdirSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

export interface EntityLoaderOptions {
  entitiesPath?: string;
  pattern?: string;
}

export class DynamicEntitiesUtil {
  /**
   * Dynamically loads all entities from the entities directory
   * @param options Configuration options for entity loading
   * @returns Array of entity classes
   */
  static loadEntitiesSync(options: EntityLoaderOptions = {}): any[] {
    const {
      entitiesPath = join(process.cwd(), 'src', 'entities'),
      pattern = '*.entity.ts'
    } = options;

    try {
      console.log('Loading entities from path:', entitiesPath);
      
      // Find all entity files synchronously
      const entityFiles = glob.sync(pattern, {
        cwd: entitiesPath,
        absolute: true
      });

      console.log('Found entity files:', entityFiles);

      const entities: any[] = [];

      // Import each entity file
      for (const filePath of entityFiles) {
        try {
          console.log('Loading entity from:', filePath);
          
          // Use require for synchronous loading
          const module = require(filePath);
          
          console.log('Module exports:', Object.keys(module));
          
          // Get all exports from the module
          const exports = Object.values(module);
          
          // Filter for classes that have the @Entity decorator
          for (const exportValue of exports) {
            if (typeof exportValue === 'function' && 
                exportValue.prototype && 
                Reflect.getMetadata('typeorm:entity', exportValue)) {
              console.log('Found entity:', exportValue.name);
              entities.push(exportValue);
            }
          }
        } catch (error) {
          console.warn(`Failed to load entity from ${filePath}:`, error);
        }
      }

      console.log('Total entities loaded:', entities.length);
      console.log('Entity names:', entities.map(e => e.name));

      return entities;
    } catch (error) {
      console.error('Error loading entities:', error);
      return [];
    }
  }

  /**
   * Loads entities from a specific directory with error handling
   * @param entitiesPath Path to entities directory
   * @returns Array of entity classes
   */
  static loadEntitiesFromPath(entitiesPath: string = './src/entities'): any[] {
    try {
      const fullPath = join(process.cwd(), entitiesPath);
      return this.loadEntitiesSync({ entitiesPath: fullPath });
    } catch (error) {
      console.error('Error loading entities from path:', error);
      return [];
    }
  }

  /**
   * Gets all entity files from the entities directory
   * @param entitiesPath Path to entities directory
   * @returns Array of entity file paths
   */
  static getEntityFiles(entitiesPath: string = './src/entities'): string[] {
    try {
      const fullPath = join(process.cwd(), entitiesPath);
      return glob.sync('*.entity.ts', {
        cwd: fullPath,
        absolute: true
      });
    } catch (error) {
      console.error('Error getting entity files:', error);
      return [];
    }
  }
} 