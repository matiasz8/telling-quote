/**
 * Formatea el contenido markdown eliminando líneas vacías innecesarias
 * entre items de listas, manteniendo solo una línea entre items principales
 */
export function formatMarkdown(content: string): string {
  const lines = content.split('\n');
  const formatted: string[] = [];
  let previousLineWasEmpty = false;
  let insideList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Detectar si estamos en una lista (bullet o numerada)
    const isBulletItem = /^[-*+]\s/.test(trimmed);
    const isNumberedItem = /^\d+\.\s/.test(trimmed);
    const isIndentedBullet = /^\s+[-*+]\s/.test(line);
    const isListItem = isBulletItem || isNumberedItem || isIndentedBullet;
    
    // Si es un item de lista, estamos dentro de una lista
    if (isListItem) {
      insideList = true;
    }
    
    // Si encontramos una línea vacía
    if (trimmed.length === 0) {
      // Si ya tuvimos una línea vacía, skip esta
      if (previousLineWasEmpty) {
        continue;
      }
      
      // Si estamos dentro de una lista, skip las líneas vacías
      if (insideList) {
        // Pero permitir una línea vacía si el siguiente item es de nivel 0 (termina la lista)
        const nextLine = lines[i + 1];
        if (nextLine) {
          const nextTrimmed = nextLine.trim();
          const nextIsTopLevelItem = /^[-*+]\s/.test(nextTrimmed) || /^\d+\.\s/.test(nextTrimmed);
          
          if (!nextIsTopLevelItem) {
            // Skip línea vacía dentro de lista
            continue;
          } else {
            // Termina la lista, permitir línea vacía
            insideList = false;
          }
        }
      }
      
      previousLineWasEmpty = true;
      formatted.push(line);
    } else {
      previousLineWasEmpty = false;
      formatted.push(line);
      
      // Si no es un item de lista y no está vacío, ya no estamos en lista
      if (!isListItem && trimmed.length > 0 && !isIndentedBullet) {
        insideList = false;
      }
    }
  }
  
  return formatted.join('\n');
}
