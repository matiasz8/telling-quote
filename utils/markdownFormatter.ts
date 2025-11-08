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
    
    // Si encontramos una línea vacía (o solo con espacios)
    if (trimmed.length === 0) {
      // Si ya tuvimos una línea vacía, skip esta
      if (previousLineWasEmpty) {
        continue;
      }
      
      // Si estamos dentro de una lista, skip TODAS las líneas vacías
      if (insideList) {
        continue;
      }
      
      previousLineWasEmpty = true;
      formatted.push(''); // Agregar línea vacía limpia (sin espacios)
    } else {
      // Línea con contenido
      previousLineWasEmpty = false;
      formatted.push(line);
      
      // Si no es un item de lista, terminamos la lista
      if (!isListItem && !isIndentedBullet) {
        // Si la siguiente línea es un item de lista de nivel 0, agregar línea vacía
        const nextLine = lines[i + 1];
        if (nextLine && insideList) {
          const nextTrimmed = nextLine.trim();
          const nextIsTopLevel = /^[-*+]\s/.test(nextTrimmed) || /^\d+\.\s/.test(nextTrimmed);
          if (nextIsTopLevel) {
            formatted.push('');
          }
        }
        insideList = false;
      }
    }
  }
  
  return formatted.join('\n');
}
