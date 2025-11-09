export interface ProcessedText {
  id: number;
  title: string;
  subtitle: string | null;
  sentence: string;
  isSubtitleIntro?: boolean; // Marca si esta oración es la introducción del subtítulo
  isBulletPoint?: boolean; // Marca si es un punto de lista
  bulletHistory?: string[]; // Histórico de bullets anteriores en esta lista
  isNumberedList?: boolean; // Marca si es una lista numerada
  indentLevel?: number; // Nivel de indentación (0 = raíz, 1 = sub-bullet, etc.)
  parentBullet?: string; // El bullet padre si es un sub-bullet
  parentIsNumbered?: boolean; // Si el padre es una lista numerada
  parentNumberIndex?: number; // El índice numérico del padre si es una lista numerada
  isCodeBlock?: boolean; // Marca si es un bloque de código
  codeLanguage?: string; // Lenguaje del código (bash, javascript, etc.)
  isBlockquote?: boolean; // Marca si es una cita/blockquote
  isHorizontalRule?: boolean; // Marca si es un separador horizontal
  isImage?: boolean; // Marca si es una imagen
  imageUrl?: string; // URL de la imagen
  imageAlt?: string; // Texto alternativo de la imagen
  isTable?: boolean; // Marca si es una tabla
  tableHeaders?: string[]; // Encabezados de la tabla
  tableRows?: string[][]; // Filas de datos de la tabla
  isCheckbox?: boolean; // Marca si es un checkbox de tarea
  isChecked?: boolean; // Si el checkbox está marcado
  isFootnoteRef?: boolean; // Marca si es una referencia a footnote [^1]
  footnoteId?: string; // ID del footnote
  isFootnoteDef?: boolean; // Marca si es la definición de un footnote [^1]: text
  footnoteText?: string; // Texto del footnote
  isMathInline?: boolean; // Marca si es matemática inline $...$
  isMathBlock?: boolean; // Marca si es bloque matemático $$...$$
  mathContent?: string; // Contenido de la ecuación matemática
}


/**
 * Helper para extraer oraciones de un párrafo preservando el markdown inline
 * Divide el texto original por puntuación, preservando todo el markdown y URLs
 */
function extractSentencesWithMarkdown(paragraphText: string): string[] {
  // Proteger URLs y enlaces markdown temporalmente
  const urlPlaceholders: string[] = [];
  let textWithPlaceholders = paragraphText;
  
  // Reemplazar enlaces markdown [texto](url) con placeholders
  textWithPlaceholders = textWithPlaceholders.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match) => {
    const placeholder = `__LINK_${urlPlaceholders.length}__`;
    urlPlaceholders.push(match);
    return placeholder;
  });
  
  // Reemplazar URLs sueltas con placeholders (http://, https://, www.)
  textWithPlaceholders = textWithPlaceholders.replace(/(https?:\/\/[^\s]+|www\.[^\s]+)/g, (match) => {
    const placeholder = `__URL_${urlPlaceholders.length}__`;
    urlPlaceholders.push(match);
    return placeholder;
  });
  
  // Ahora dividir por oraciones en el texto con placeholders
  const sentenceRegex = /[^.!?]+[.!?]+/g;
  const sentences = textWithPlaceholders.match(sentenceRegex);
  
  if (sentences && sentences.length > 0) {
    // Restaurar URLs y enlaces en cada oración
    return sentences
      .map(s => {
        let restored = s.trim();
        urlPlaceholders.forEach((original, index) => {
          restored = restored.replace(`__LINK_${index}__`, original);
          restored = restored.replace(`__URL_${index}__`, original);
        });
        return restored;
      })
      .filter(s => s.length > 0);
  }
  
  // Si no se detectaron oraciones, restaurar y retornar el párrafo completo
  let restored = textWithPlaceholders.trim();
  urlPlaceholders.forEach((original, index) => {
    restored = restored.replace(`__LINK_${index}__`, original);
    restored = restored.replace(`__URL_${index}__`, original);
  });
  
  return restored.length > 0 ? [restored] : [];
}


interface Section {
  subtitle: string | null;
  content: string;
}

/**
 * Processes raw article content into a list of sentences,
 * each associated with the main article title and current subtitle.
 * @param title - The main title of the reading.
 * @param content - The raw text content (all paragraphs).
 */
export function processContent(title: string, content: string): ProcessedText[] {
  // Split content into lines
  const lines = content.split('\n');
  const sections: Section[] = [];
  let currentSubtitle: string | null = null;
  let currentContent: string[] = [];
  let insideCodeBlock = false; // Track if we're inside a code block

  // Process lines to identify sections with subtitles
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Detectar bloques de código (```) y alternar el estado
    if (trimmedLine.startsWith('```')) {
      insideCodeBlock = !insideCodeBlock;
      currentContent.push(line);
      continue;
    }

    // Si estamos dentro de un bloque de código, no procesar como heading
    if (insideCodeBlock) {
      currentContent.push(line);
      continue;
    }

    // Check if line is a markdown heading (##, ###, etc.)
    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);

    // Check if line is a numbered or bulleted list (to exclude from heading detection)
    const isNumberedList = /^\d+\.\s+/.test(trimmedLine);
    const isBulletList = /^[-*+]\s+/.test(trimmedLine);

    // Heuristic: heading-like line (no markdown) - short, surrounded by blank lines, no terminal punctuation
    const prevIsBlank = i === 0 || lines[i - 1].trim().length === 0;
    const nextIsBlank = i === lines.length - 1 || lines[i + 1].trim().length === 0;
    const endsWithSentencePunct = /[.!?؛؟]$/.test(trimmedLine);
    const isReasonableLength = trimmedLine.length > 0 && trimmedLine.length <= 120;
    const words = trimmedLine.split(/\s+/);
    const titleCaseRatio = words.length > 0
      ? words.filter((w) => /^(?:[A-ZÁÉÍÓÚÜÑ¿¡]|\d)/.test(w)).length / words.length
      : 0;
    const startsWithInverted = /^[¿¡]/.test(trimmedLine);
    const endsWithQuestionOrExclaim = /[?¿!¡]$/.test(trimmedLine);
    const looksLikeHeading =
      !headingMatch &&
      !isNumberedList &&
      !isBulletList &&
      prevIsBlank &&
      nextIsBlank &&
      isReasonableLength &&
      (titleCaseRatio >= 0.4 || startsWithInverted) &&
      (!endsWithSentencePunct || endsWithQuestionOrExclaim);

    if (headingMatch || looksLikeHeading) {
      // Save previous section if it has content
      if (currentContent.length > 0) {
        sections.push({
          subtitle: currentSubtitle,
          content: currentContent.join('\n'),
        });
        currentContent = [];
      }

      // Extract subtitle text (remove # and trim)
      const rawSubtitle = headingMatch ? headingMatch[2] : trimmedLine;
      currentSubtitle = rawSubtitle
        .replace(/^#{1,6}\s+/, '')
        .replace(/\*\*/g, '') // Remove bold markers
        .replace(/\*/g, '') // Remove italic markers
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links, keep text
        .trim();
    } else if (trimmedLine.length > 0) {
      // Regular content line
      currentContent.push(line);
    } else if (trimmedLine.length === 0 && currentContent.length > 0) {
      // Empty line - keep it for paragraph separation
      currentContent.push('');
    }
  }

  // Add the last section
  if (currentContent.length > 0) {
    sections.push({
      subtitle: currentSubtitle,
      content: currentContent.join('\n'),
    });
  }

  // Process each section into sentences
  const processedText: ProcessedText[] = [];
  let globalIndex = 0;

  for (const section of sections) {
    // Add subtitle introduction slide if there's a subtitle
    if (section.subtitle) {
      processedText.push({
        id: globalIndex++,
        title: title,
        subtitle: null, // No subtitle shown in the header yet
        sentence: section.subtitle,
        isSubtitleIntro: true, // Mark this as the subtitle intro
      });
    }

    const sectionLines = section.content.split('\n');
    let currentParagraph: string[] = [];
    const bulletHistoryByLevel: Record<number, string[]> = {}; // Historial separado por nivel
    let lastParentBullet: string | null = null; // Guarda el último bullet de nivel 0
    let parentIsNumbered = false; // Indica si el padre es una lista numerada
    let parentNumberIndex = 0; // Índice del número del padre
    let lastIndentLevel = 0; // Trackea el último nivel de indentación procesado
    let insideCodeBlock = false; // Indica si estamos dentro de un bloque de código
    let codeBlockLines: string[] = []; // Acumula las líneas del bloque de código
    let codeLanguage = ''; // Lenguaje del bloque de código
    let insideTable = false; // Indica si estamos procesando una tabla
    let tableLines: string[] = []; // Acumula las líneas de la tabla

    for (const line of sectionLines) {
      const trimmedLine = line.trim();
      
      // Detectar bloques de código (```)
      if (trimmedLine.startsWith('```')) {
        if (!insideCodeBlock) {
          // Inicio de bloque de código
          insideCodeBlock = true;
          codeLanguage = trimmedLine.substring(3).trim() || 'text';
          codeBlockLines = [];
        } else {
          // Fin de bloque de código
          insideCodeBlock = false;
          if (codeBlockLines.length > 0) {
            processedText.push({
              id: globalIndex++,
              title: title,
              subtitle: section.subtitle,
              sentence: codeBlockLines.join('\n'),
              isCodeBlock: true,
              codeLanguage: codeLanguage,
            });
          }
          codeBlockLines = [];
          codeLanguage = '';
        }
        continue;
      }
      
      // Si estamos dentro de un bloque de código, acumular líneas
      if (insideCodeBlock) {
        codeBlockLines.push(line);
        continue;
      }
      
      // Detectar nivel de indentación (contar espacios/tabs al inicio)
      const indentMatch = line.match(/^(\s*)/);
      const indentLevel = indentMatch ? Math.floor(indentMatch[1].length / 2) : 0; // Cada 2 espacios = 1 nivel

      // Detectar separadores horizontales (---, ***, ___) y omitirlos
      if (/^[-*_]{3,}$/.test(trimmedLine)) {
        // Procesar párrafo acumulado antes del separador
        if (currentParagraph.length > 0) {
          const paragraphText = currentParagraph.join(' ').trim();
          if (paragraphText.length > 0) {
            const sentences = extractSentencesWithMarkdown(paragraphText);
            for (const sentence of sentences) {
              if (sentence.length > 0) {
                processedText.push({
                  id: globalIndex++,
                  title: title,
                  subtitle: section.subtitle,
                  sentence: sentence,
                });
              }
            }
          }
          currentParagraph = [];
        }
        
        // Simplemente omitir el separador, no crear un slide para él
        continue;
      }

      // Detectar tablas (líneas que empiezan con |)
      const tableRowMatch = trimmedLine.match(/^\|(.+)\|$/);
      if (tableRowMatch) {
        // Acumular líneas de tabla
        if (!insideTable) {
          // Primera línea de la tabla (headers)
          insideTable = true;
          tableLines = [trimmedLine];
        } else {
          tableLines.push(trimmedLine);
        }
        continue;
      } else if (insideTable) {
        // Fin de la tabla - procesarla
        if (tableLines.length >= 2) {
          // Parsear headers (primera línea)
          const headers = tableLines[0]
            .split('|')
            .slice(1, -1) // Remover primero y último vacío
            .map((h: string) => h.trim());
          
          // Parsear rows (saltar la línea de separadores |---|---|)
          const rows: string[][] = [];
          for (let i = 2; i < tableLines.length; i++) {
            const cells = tableLines[i]
              .split('|')
              .slice(1, -1)
              .map((c: string) => c.trim());
            rows.push(cells);
          }
          
          processedText.push({
            id: globalIndex++,
            title: title,
            subtitle: section.subtitle,
            sentence: `Table: ${headers.join(', ')}`,
            isTable: true,
            tableHeaders: headers,
            tableRows: rows,
          });
        }
        insideTable = false;
        tableLines = [];
        // No hacer continue, procesar esta línea normalmente
      }

      // Detectar imágenes en formato markdown ![alt](url)
      const imageMatch = trimmedLine.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imageMatch) {
        // Procesar párrafo acumulado antes de la imagen
        if (currentParagraph.length > 0) {
          const paragraphText = currentParagraph.join(' ').trim();
          if (paragraphText.length > 0) {
            const sentences = extractSentencesWithMarkdown(paragraphText);
            for (const sentence of sentences) {
              if (sentence.length > 0) {
                processedText.push({
                  id: globalIndex++,
                  title: title,
                  subtitle: section.subtitle,
                  sentence: sentence,
                });
              }
            }
          }
          currentParagraph = [];
        }
        
        // Agregar la imagen como slide
        const [, alt, url] = imageMatch;
        processedText.push({
          id: globalIndex++,
          title: title,
          subtitle: section.subtitle,
          sentence: alt || 'Image',
          isImage: true,
          imageUrl: url,
          imageAlt: alt,
        });
        continue;
      }

      // Detectar blockquotes (líneas que empiezan con >)
      const blockquoteMatch = trimmedLine.match(/^>\s*(.+)$/);
      if (blockquoteMatch) {
        // Procesar párrafo acumulado antes del blockquote
        if (currentParagraph.length > 0) {
          const paragraphText = currentParagraph.join(' ').trim();
          if (paragraphText.length > 0) {
            const sentences = extractSentencesWithMarkdown(paragraphText);
            for (const sentence of sentences) {
              if (sentence.length > 0) {
                processedText.push({
                  id: globalIndex++,
                  title: title,
                  subtitle: section.subtitle,
                  sentence: sentence,
                });
              }
            }
          }
          currentParagraph = [];
        }
        
        // Agregar el blockquote
        const quoteText = blockquoteMatch[1];
        processedText.push({
          id: globalIndex++,
          title: title,
          subtitle: section.subtitle,
          sentence: quoteText,
          isBlockquote: true,
        });
        continue;
      }

      // Skip empty lines
      if (trimmedLine.length === 0) {
        // Process accumulated paragraph if there's content
        if (currentParagraph.length > 0) {
          const paragraphText = currentParagraph.join(' ').trim();
          if (paragraphText.length > 0) {
            // Remove markdown formatting
            const cleanText = paragraphText
              .replace(/\*\*/g, '')
              .replace(/\*/g, '')
              .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
            
            // Split into sentences
            const sentences = cleanText.match(/[^.!?]+[.!?]/g) || [];
            if (sentences.length > 0) {
              for (const sentence of sentences) {
                const trimmedSentence = sentence.trim();
                if (trimmedSentence.length > 0) {
                  processedText.push({
                    id: globalIndex++,
                    title: title,
                    subtitle: section.subtitle,
                    sentence: trimmedSentence,
                  });
                }
              }
            } else if (cleanText.length > 0) {
              processedText.push({
                id: globalIndex++,
                title: title,
                subtitle: section.subtitle,
                sentence: cleanText,
              });
            }
          }
          currentParagraph = [];
        }
        // Solo reset si la línea NO tiene espacios de indentación (realmente vacía)
        // Si tiene espacios, puede ser parte de una lista indentada
        if (line.trim().length === 0 && line.length === 0) {
          // Limpiar todos los historiales cuando hay línea completamente vacía
          Object.keys(bulletHistoryByLevel).forEach(level => {
            delete bulletHistoryByLevel[parseInt(level)];
          });
          parentIsNumbered = false; // Reset al terminar una lista
          parentNumberIndex = 0; // Reset índice
        }
        continue; // Skip this line
      }

      // Check if line is a bullet point or numbered list
      const bulletMatch = trimmedLine.match(/^[-*+]\s+(.+)$/);
      const numberedMatch = bulletMatch ? null : trimmedLine.match(/^\d+\.\s+(.+)$/);
      // Check for task list items (checkboxes)
      const checkboxMatch = trimmedLine.match(/^[-*+]\s+\[([ xX])\]\s+(.+)$/);
      // Heuristic bullet: "Label: description" style
      const colonBulletMatch = bulletMatch || numberedMatch || checkboxMatch ? null : trimmedLine.match(/^(?=.{3,120}$)([A-ZÁÉÍÓÚÜÑ¿¡][^:]{1,80}):\s+(.+)$/);

      // Handle checkboxes separately
      if (checkboxMatch) {
        // Process accumulated paragraph first
        if (currentParagraph.length > 0) {
          const paragraphText = currentParagraph.join(' ').trim();
          if (paragraphText.length > 0) {
            const sentences = extractSentencesWithMarkdown(paragraphText);
            for (const sentence of sentences) {
              if (sentence.length > 0) {
                processedText.push({
                  id: globalIndex++,
                  title: title,
                  subtitle: section.subtitle,
                  sentence: sentence,
                });
              }
            }
            currentParagraph = [];
          }
        }
        
        const isChecked = checkboxMatch[1].toLowerCase() === 'x';
        const taskText = checkboxMatch[2].trim();
        
        processedText.push({
          id: globalIndex++,
          title: title,
          subtitle: section.subtitle,
          sentence: taskText,
          isCheckbox: true,
          isChecked: isChecked,
        });
        continue;
      }

      // Check for footnote definition: [^1]: text
      const footnoteDefMatch = trimmedLine.match(/^\[\^([^\]]+)\]:\s+(.+)$/);
      if (footnoteDefMatch) {
        // Process accumulated paragraph first
        if (currentParagraph.length > 0) {
          const paragraphText = currentParagraph.join(' ').trim();
          if (paragraphText.length > 0) {
            const sentences = extractSentencesWithMarkdown(paragraphText);
            for (const sentence of sentences) {
              if (sentence.length > 0) {
                processedText.push({
                  id: globalIndex++,
                  title: title,
                  subtitle: section.subtitle,
                  sentence: sentence,
                });
              }
            }
            currentParagraph = [];
          }
        }
        
        const footnoteId = footnoteDefMatch[1].trim();
        const footnoteText = footnoteDefMatch[2].trim();
        
        processedText.push({
          id: globalIndex++,
          title: title,
          subtitle: section.subtitle,
          sentence: footnoteText,
          isFootnoteDef: true,
          footnoteId: footnoteId,
          footnoteText: footnoteText,
        });
        continue;
      }

      // Check for block math: $$...$$
      const blockMathMatch = trimmedLine.match(/^\$\$(.+)\$\$$/);
      if (blockMathMatch) {
        // Process accumulated paragraph first
        if (currentParagraph.length > 0) {
          const paragraphText = currentParagraph.join(' ').trim();
          if (paragraphText.length > 0) {
            const sentences = extractSentencesWithMarkdown(paragraphText);
            for (const sentence of sentences) {
              if (sentence.length > 0) {
                processedText.push({
                  id: globalIndex++,
                  title: title,
                  subtitle: section.subtitle,
                  sentence: sentence,
                });
              }
            }
            currentParagraph = [];
          }
        }
        
        const mathContent = blockMathMatch[1].trim();
        
        processedText.push({
          id: globalIndex++,
          title: title,
          subtitle: section.subtitle,
          sentence: mathContent,
          isMathBlock: true,
          mathContent: mathContent,
        });
        continue;
      }

      if (bulletMatch || numberedMatch) {
        // Process accumulated paragraph first
        if (currentParagraph.length > 0) {
          const paragraphText = currentParagraph.join(' ').trim();
          if (paragraphText.length > 0) {
            const sentences = extractSentencesWithMarkdown(paragraphText);
            for (const sentence of sentences) {
              if (sentence.length > 0) {
                processedText.push({
                  id: globalIndex++,
                  title: title,
                  subtitle: section.subtitle,
                  sentence: sentence,
                });
              }
            }
            currentParagraph = [];
          }
          // NO resetear parentIsNumbered ni parentNumberIndex aquí - solo cuando termina la lista completa
        }
        
        // Process bullet point or numbered item and add to history
        const match = bulletMatch || numberedMatch;
        const bulletText = match![1].trim();
        // Keep markdown formatting in bulletText (don't clean it)
        
        if (bulletText.length > 0) {
          // Inicializar historial del nivel si no existe
          if (!bulletHistoryByLevel[indentLevel]) {
            bulletHistoryByLevel[indentLevel] = [];
          }
          
          // Si cambia el nivel de indentación, limpiar niveles superiores
          if (indentLevel !== lastIndentLevel) {
            // Limpiar historiales de niveles mayores que el actual
            Object.keys(bulletHistoryByLevel).forEach(level => {
              if (parseInt(level) > indentLevel) {
                delete bulletHistoryByLevel[parseInt(level)];
              }
            });
            lastIndentLevel = indentLevel;
          }
          
          // Guardar el bullet padre si es de nivel 0
          if (indentLevel === 0) {
            lastParentBullet = bulletText;
            parentIsNumbered = !!numberedMatch; // Rastrear si el padre es numerado
            // Extraer el índice numérico si es numerado
            if (numberedMatch) {
              const numberMatch = trimmedLine.match(/^(\d+)\./);
              parentNumberIndex = numberMatch ? parseInt(numberMatch[1], 10) : 0;
            } else {
              parentNumberIndex = 0; // Reset si no es numerado
            }
          }
          
          // Add current bullet to history of this level
          bulletHistoryByLevel[indentLevel].push(bulletText);
          
          // Create a slide with all bullets accumulated so far
          const slide = {
            id: globalIndex++,
            title: title,
            subtitle: section.subtitle,
            sentence: bulletText, // El bullet actual
            isBulletPoint: true,
            isNumberedList: !!numberedMatch, // Marca si es lista numerada
            bulletHistory: [...(bulletHistoryByLevel[indentLevel] || []).slice(0, -1)], // Todos los bullets anteriores del mismo nivel
            indentLevel: indentLevel,
            parentBullet: indentLevel > 0 && lastParentBullet ? lastParentBullet : undefined,
            parentIsNumbered: indentLevel > 0 && lastParentBullet ? parentIsNumbered : undefined, // Si tiene padre, usar su tipo
            parentNumberIndex: indentLevel > 0 && lastParentBullet && parentIsNumbered ? parentNumberIndex : undefined,
          };
          
          processedText.push(slide);
        }
      } else if (colonBulletMatch) {
        // Treat label: description as a bullet item
        const bulletText = `${colonBulletMatch[1].trim()}: ${colonBulletMatch[2].trim()}`;
        // Keep markdown formatting

        // Flush paragraph before adding bullet
        if (currentParagraph.length > 0) {
          const paragraphText = currentParagraph.join(' ').trim();
          if (paragraphText.length > 0) {
            const sentences = extractSentencesWithMarkdown(paragraphText);
            for (const sentence of sentences) {
              if (sentence.length > 0) {
                processedText.push({
                  id: globalIndex++,
                  title: title,
                  subtitle: section.subtitle,
                  sentence: sentence,
                });
              }
            }
          }
          currentParagraph = [];
          // Reset bullet history when starting a new bullet list (colon style is always level 0)
          if (bulletHistoryByLevel[0]) {
            bulletHistoryByLevel[0] = [];
          }
        }

        if (bulletText.length > 0) {
          // Inicializar historial del nivel 0 si no existe
          if (!bulletHistoryByLevel[0]) {
            bulletHistoryByLevel[0] = [];
          }
          
          // Add current bullet to history
          bulletHistoryByLevel[0].push(bulletText);
          
          // Create a slide with all bullets accumulated so far
          processedText.push({
            id: globalIndex++,
            title: title,
            subtitle: section.subtitle,
            sentence: bulletText, // El bullet actual
            isBulletPoint: true,
            bulletHistory: [...(bulletHistoryByLevel[0] || []).slice(0, -1)], // Todos los bullets anteriores
          });
        }
      } else if (trimmedLine.length > 0) {
        // Regular paragraph line
        // Reset bullet history when we encounter regular text
        const hasAnyBullets = Object.keys(bulletHistoryByLevel).length > 0;
        if (hasAnyBullets) {
          Object.keys(bulletHistoryByLevel).forEach(level => {
            delete bulletHistoryByLevel[parseInt(level)];
          });
        }
        currentParagraph.push(trimmedLine);
      } else {
        // Empty line - process accumulated paragraph
        if (currentParagraph.length > 0) {
          const paragraphText = currentParagraph.join(' ').trim();
          if (paragraphText.length > 0) {
            const sentences = extractSentencesWithMarkdown(paragraphText);
            for (const sentence of sentences) {
              if (sentence.length > 0) {
                processedText.push({
                  id: globalIndex++,
                  title: title,
                  subtitle: section.subtitle,
                  sentence: sentence,
                });
              }
            }
          }
          currentParagraph = [];
        }
      }
    }

    // Process remaining paragraph
    if (currentParagraph.length > 0) {
      const paragraphText = currentParagraph.join(' ').trim();
      if (paragraphText.length > 0) {
        const sentences = extractSentencesWithMarkdown(paragraphText);
        for (const sentence of sentences) {
          if (sentence.length > 0) {
            processedText.push({
              id: globalIndex++,
              title: title,
              subtitle: section.subtitle,
              sentence: sentence,
            });
          }
        }
      }
    }
  }

  return processedText;
}

